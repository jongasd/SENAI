# main.py — MIDI Keyboard IoT
# SENAI Ítalo Bologna — Curso Técnico em Desenvolvimento de Sistemas
#
# Projeto: Teclado MIDI com 12 botões (1 oitava) + 7 buzzers PWM + LED RGB + MQTT
#
# Fluxo geral:
#   Botões (GP0–GP11) → debounce → som local (PWM) + LED RGB → payload JSON → MQTT
#
# Funcionalidades:
#   ✓ Leitura de 12 botões com pull-up interno (ativo em LOW)
#   ✓ Debounce por software (DEBOUNCE_MS)
#   ✓ 7 buzzers PWM (1 por tecla branca) — sustenidos reaproveitam o buzzer da branca vizinha
#   ✓ Roubo de buzzer: a última tecla pressionada que compartilha buzzer "ganha" o som
#   ✓ LED RGB único, cor muda conforme a última nota tocada
#   ✓ Publicação de JSON no evento pressed / released
#   ✓ Heartbeat de status a cada HEARTBEAT_SEC segundos
#   ✓ Reconexão automática de Wi-Fi
#   ✓ Reconexão automática de MQTT
#   ✓ Loop principal blindado: erro em uma iteração NUNCA mata o programa
#   ✓ LED embutido indica estado: piscando = sem MQTT, aceso = conectado

import ujson
import utime
import machine
from machine import Pin, PWM
from umqtt.simple import MQTTClient

from config import (
    BROKER_IP, BROKER_PORT, CLIENT_ID,
    TOPIC_EVENTS, TOPIC_STATUS,
    BUTTON_MAP, DEBOUNCE_MS,
    HEARTBEAT_SEC, MQTT_RETRY_SEC,
    BUZZER_PINS, RGB_PINS,
    NOTE_FREQ, NOTE_COLORS, LED_OFF,
    get_buzzer_key,
)
from WIFI_CONNECT import conectar_wifi, esta_conectado


# ─── LED EMBUTIDO ─────────────────────────────────────────────────────────────
# No Pico 2W o LED é controlado pelo CYW43 via "LED", não pelo GP25 diretamente
led = Pin("LED", Pin.OUT)


# ─── CLASSE: BOTÃO COM DEBOUNCE ───────────────────────────────────────────────
class BotaoDebounce:
    """
    Representa um botão físico com debounce por software.

    Hardware: botão entre GP_PIN e GND.
    Software: pull-up interno → lógica invertida (0 = pressionado).

    O debounce evita múltiplos disparos causados pelo bouncing mecânico
    dos contatos do botão nos primeiros milissegundos após o acionamento.
    """

    def __init__(self, pin_num: int, nota: str, key_num: int):
        self.pin    = Pin(pin_num, Pin.IN, Pin.PULL_UP)
        self.nota   = nota
        self.key    = key_num

        # Estado anterior estável (True = solto, False = pressionado)
        self._estado_anterior  = True
        # Momento da última mudança de estado detectada
        self._ultimo_tick      = 0
        # Estado confirmado após debounce
        self._estado_confirmado = True

    def verificar(self):
        """
        Verifica o botão e retorna um evento se houver mudança de estado.

        Retorna:
            "pressed"  → botão acabou de ser pressionado
            "released" → botão acabou de ser solto
            None       → nenhuma mudança estável detectada
        """
        leitura_atual = self.pin.value()   # 0=pressionado, 1=solto (pull-up)
        agora         = utime.ticks_ms()

        # Detecta transição de estado
        if leitura_atual != self._estado_anterior:
            self._ultimo_tick    = agora
            self._estado_anterior = leitura_atual

        # Aguarda DEBOUNCE_MS sem nova transição antes de confirmar
        if utime.ticks_diff(agora, self._ultimo_tick) >= DEBOUNCE_MS:
            if leitura_atual != self._estado_confirmado:
                self._estado_confirmado = leitura_atual
                # pull-up: LOW (0) = pressionado, HIGH (1) = solto
                return "pressed" if leitura_atual == 0 else "released"

        return None


# ─── CLASSE: BUZZERS PWM (POLIFONIA POR REAPROVEITAMENTO) ────────────────────
class BuzzerPiano:
    """
    Gerencia os 7 buzzers PWM (1 por tecla branca).

    Sustenidos (teclas pretas) reaproveitam o buzzer da branca vizinha
    (get_buzzer_key). Quando duas notas que compartilham o mesmo buzzer
    são pressionadas, a última pressionada "rouba" o buzzer da anterior
    (a anterior é silenciada sem disparar evento de released duplicado).

    Isso permite tocar até 7 notas simultâneas (acorde), desde que sejam
    de buzzers diferentes — exatamente como pedido (1 buzzer por branca).
    """

    def __init__(self):
        self._pwms = {}        # buzzer_key -> PWM object
        self._dono_atual = {}  # buzzer_key -> key (int) da tecla que está soando, ou None

        for buzzer_key, pin_num in BUZZER_PINS.items():
            pwm = PWM(Pin(pin_num))
            pwm.duty_u16(0)  # começa mudo
            self._pwms[buzzer_key] = pwm
            self._dono_atual[buzzer_key] = None

    def tocar(self, nota: str, key: int):
        """
        Liga o buzzer correspondente à nota, na frequência certa.
        Se o buzzer já está sendo usado por outra tecla, essa tecla
        "rouba" o buzzer (comportamento esperado quando C e C# disputam
        o mesmo buzzer, por exemplo).
        """
        buzzer_key = get_buzzer_key(nota)
        pwm = self._pwms.get(buzzer_key)
        if pwm is None:
            return

        freq = NOTE_FREQ.get(nota, 440)
        try:
            pwm.freq(freq)
            pwm.duty_u16(32768)  # ~50% duty cycle
        except Exception as e:
            print(f"[BUZZER] Erro ao tocar {nota}: {e}")

        self._dono_atual[buzzer_key] = key

    def parar(self, nota: str, key: int):
        """
        Desliga o buzzer da nota, MAS apenas se a tecla que está soltando
        ainda for a "dona" atual do buzzer. Isso evita que soltar C#
        corte o som de C, se C tiver roubado o buzzer depois.
        """
        buzzer_key = get_buzzer_key(nota)
        pwm = self._pwms.get(buzzer_key)
        if pwm is None:
            return

        if self._dono_atual.get(buzzer_key) == key:
            try:
                pwm.duty_u16(0)
            except Exception as e:
                print(f"[BUZZER] Erro ao parar {nota}: {e}")
            self._dono_atual[buzzer_key] = None

    def parar_tudo(self):
        for pwm in self._pwms.values():
            try:
                pwm.duty_u16(0)
            except Exception:
                pass
        for k in self._dono_atual:
            self._dono_atual[k] = None


# ─── CLASSE: LED RGB (PWM, cor por nota) ──────────────────────────────────────
class LedRgb:
    """
    LED RGB único, controlado por 3 canais PWM (R, G, B).
    A cor exibida reflete a última nota pressionada. Quando todas as
    notas são soltas, o LED apaga.
    """

    def __init__(self):
        self._pwm_r = PWM(Pin(RGB_PINS["R"]))
        self._pwm_g = PWM(Pin(RGB_PINS["G"]))
        self._pwm_b = PWM(Pin(RGB_PINS["B"]))
        for pwm in (self._pwm_r, self._pwm_g, self._pwm_b):
            pwm.freq(1000)
            pwm.duty_u16(0)

        self._notas_ativas = []  # pilha de notas atualmente pressionadas

    def _aplicar_cor(self, rgb):
        r, g, b = rgb
        # Converte 0–255 para escala de 16 bits (0–65535) do duty_u16
        try:
            self._pwm_r.duty_u16(int(r / 255 * 65535))
            self._pwm_g.duty_u16(int(g / 255 * 65535))
            self._pwm_b.duty_u16(int(b / 255 * 65535))
        except Exception as e:
            print(f"[RGB] Erro ao aplicar cor: {e}")

    def nota_pressionada(self, nota: str):
        if nota in self._notas_ativas:
            self._notas_ativas.remove(nota)
        self._notas_ativas.append(nota)  # vai para o topo da pilha
        cor = NOTE_COLORS.get(nota, LED_OFF)
        self._aplicar_cor(cor)

    def nota_solta(self, nota: str):
        if nota in self._notas_ativas:
            self._notas_ativas.remove(nota)

        if self._notas_ativas:
            # Volta a mostrar a cor da nota anterior ainda pressionada
            ultima = self._notas_ativas[-1]
            cor = NOTE_COLORS.get(ultima, LED_OFF)
            self._aplicar_cor(cor)
        else:
            self._aplicar_cor(LED_OFF)

    def apagar(self):
        self._notas_ativas = []
        self._aplicar_cor(LED_OFF)


# ─── CLASSE: CLIENTE MQTT COM RECONEXÃO ───────────────────────────────────────
class MqttPiano:
    """
    Gerencia a conexão MQTT e a publicação de eventos do teclado.

    Encapsula a lógica de conexão/reconexão para manter o loop
    principal limpo e focado na leitura dos botões.
    """

    def __init__(self):
        self._cliente   = None
        self._conectado = False

    def conectar(self) -> bool:
        """
        Cria o cliente MQTT e conecta ao broker.
        Retorna True se conectou com sucesso.
        """
        try:
            self._cliente = MQTTClient(
                client_id = CLIENT_ID,
                server    = BROKER_IP,
                port      = BROKER_PORT,
                keepalive = 60          # broker aguarda até 60s sem mensagem
            )
            self._cliente.connect()
            self._conectado = True

            # Publica mensagem de "online" no tópico de status (LWT alternativo)
            self._publicar_status("online")
            print(f"[MQTT] Conectado → {BROKER_IP}:{BROKER_PORT}")
            return True

        except Exception as e:
            print(f"[MQTT] Falha ao conectar: {e}")
            self._conectado = False
            return False

    def reconectar(self) -> bool:
        """
        Tenta reconectar ao broker MQTT após perda de conexão.
        Aguarda MQTT_RETRY_SEC entre cada tentativa.
        """
        print("[MQTT] Tentando reconectar...")
        self._conectado = False
        led.value(0)  # LED apagado indica desconexão

        # Garante Wi-Fi antes de tentar MQTT
        if not esta_conectado():
            print("[MQTT] Wi-Fi perdido. Reconectando Wi-Fi primeiro...")
            if not conectar_wifi():
                return False

        utime.sleep(MQTT_RETRY_SEC)
        return self.conectar()

    def publicar_evento(self, nota: str, key: int, estado: str) -> bool:
        """
        Publica um evento de tecla no tópico TOPIC_EVENTS.

        Payload JSON:
        {
            "note":      "C",
            "key":       1,
            "state":     "pressed",
            "timestamp": 1712345678
        }
        """
        if not self._conectado:
            return False

        payload = ujson.dumps({
            "note":      nota,
            "key":       key,
            "state":     estado,
            "timestamp": utime.time()
        })

        try:
            self._cliente.publish(TOPIC_EVENTS, payload.encode())
            print(f"[PUB] {payload}")
            return True

        except Exception as e:
            print(f"[MQTT] Erro ao publicar: {e}")
            self._conectado = False
            return False

    def _publicar_status(self, estado: str):
        """
        Publica heartbeat no tópico de status.
        estado: "online" ou "offline"
        """
        payload = ujson.dumps({
            "client_id": CLIENT_ID,
            "status":    estado,
            "timestamp": utime.time()
        })
        try:
            self._cliente.publish(TOPIC_STATUS, payload.encode())
        except:
            pass  # Status é best-effort, não interrompe o fluxo

    def heartbeat(self):
        """Publica sinal de vida periódico."""
        self._publicar_status("online")

    @property
    def conectado(self) -> bool:
        return self._conectado


# ─── INICIALIZAÇÃO DOS BOTÕES ─────────────────────────────────────────────────
def criar_botoes() -> list:
    """
    Instancia um BotaoDebounce para cada entrada em BUTTON_MAP.
    Retorna lista ordenada por key (1–12).
    """
    botoes = []
    for cfg in BUTTON_MAP:
        b = BotaoDebounce(cfg["pin"], cfg["note"], cfg["key"])
        botoes.append(b)
        print(f"[GPIO] GP{cfg['pin']:02d} → Tecla {cfg['key']:2d} ({cfg['note']})")
    return botoes


# ─── LOOP PRINCIPAL ───────────────────────────────────────────────────────────
def main():
    print("=" * 50)
    print(" SENAI MIDI Keyboard — Pico 2W")
    print(f" Cliente: {CLIENT_ID}")
    print(f" Broker:  {BROKER_IP}:{BROKER_PORT}")
    print("=" * 50)

    # 1. Conecta Wi-Fi (bloqueia até conseguir ou esgotar retentativas)
    if not conectar_wifi():
        print("[MAIN] Falha crítica de Wi-Fi. Reiniciando em 10s...")
        utime.sleep(10)
        machine.reset()

    # 2. Inicializa botões, buzzers e LED RGB
    botoes = criar_botoes()
    print(f"[MAIN] {len(botoes)} botões configurados.")

    buzzers = BuzzerPiano()
    print("[MAIN] 7 buzzers PWM inicializados.")

    rgb = LedRgb()
    print("[MAIN] LED RGB inicializado.")

    # 3. Inicializa MQTT
    mqtt = MqttPiano()
    while not mqtt.conectar():
        print(f"[MAIN] Aguardando broker MQTT em {BROKER_IP}...")
        utime.sleep(MQTT_RETRY_SEC)

    led.value(1)  # LED aceso = MQTT conectado

    # 4. Variáveis de controle do heartbeat e Wi-Fi
    ultimo_heartbeat   = utime.ticks_ms()
    ultimo_check_wifi  = utime.ticks_ms()
    WIFI_CHECK_MS      = 2000  # checa Wi-Fi a cada 2s, não toda iteração

    print("[MAIN] Aguardando eventos de teclado...")
    print("-" * 50)

    # ─── LOOP INFINITO ────────────────────────────────────────────────────────
    # IMPORTANTE: cada iteração roda dentro de seu próprio try/except.
    # Isso garante que UM erro pontual (timeout de socket, GC, etc.)
    # nunca mate o loop inteiro — ele só pula para a próxima iteração.
    # Esse era o suspeito nº1 do bug "só toca uma vez e trava".
    while True:
        try:
            # Verifica Wi-Fi periodicamente (não a cada ciclo, para não
            # adicionar latência perceptível ao toque das teclas)
            agora_wifi = utime.ticks_ms()
            if utime.ticks_diff(agora_wifi, ultimo_check_wifi) >= WIFI_CHECK_MS:
                ultimo_check_wifi = agora_wifi
                if not esta_conectado():
                    print("[MAIN] Wi-Fi perdido!")
                    led.value(0)
                    conectar_wifi()

            # Lê cada botão e reage se houve mudança de estado
            for botao in botoes:
                evento = botao.verificar()

                if evento is None:
                    continue

                # ── Som local (PWM) e LED — SEMPRE executam,
                #    independente do estado do MQTT ──
                if evento == "pressed":
                    buzzers.tocar(botao.nota, botao.key)
                    rgb.nota_pressionada(botao.nota)
                else:  # "released"
                    buzzers.parar(botao.nota, botao.key)
                    rgb.nota_solta(botao.nota)

                # ── Publicação MQTT (best-effort; nunca bloqueia o som) ──
                sucesso = mqtt.publicar_evento(botao.nota, botao.key, evento)

                if not sucesso:
                    led.value(0)
                    if mqtt.reconectar():
                        led.value(1)
                        mqtt.publicar_evento(botao.nota, botao.key, evento)

            # Heartbeat a cada HEARTBEAT_SEC segundos
            agora_hb = utime.ticks_ms()
            if utime.ticks_diff(agora_hb, ultimo_heartbeat) >= HEARTBEAT_SEC * 1000:
                mqtt.heartbeat()
                ultimo_heartbeat = agora_hb

        except Exception as e:
            # Loga e segue vivo. Sem isso, qualquer exceção aqui dentro
            # (ex: socket timeout no publish) propagava pro try/except
            # de fora e o programa só reagia a UM evento antes de morrer
            # silenciosamente ou resetar de forma inconsistente.
            print(f"[LOOP] Erro recuperável: {e}")
            utime.sleep_ms(50)

        # Pequena pausa para não saturar a CPU (1ms é suficiente para debounce)
        utime.sleep_ms(1)


# ─── ENTRY POINT ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n[MAIN] Interrompido pelo usuário.")
        led.value(0)
    except Exception as e:
        print(f"[MAIN] Erro fatal: {e}")
        print("[MAIN] Reiniciando em 5s...")
        utime.sleep(5)
        machine.reset()
