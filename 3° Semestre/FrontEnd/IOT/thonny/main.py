# main.py — MIDI Keyboard IoT
# SENAI Ítalo Bologna — Curso Técnico em Desenvolvimento de Sistemas
#
# Projeto: Teclado MIDI com 12 botões (1 oitava) + 7 buzzers PWM + MQTT
#
# ── CORREÇÃO DE PWM (mantida desta versão) ────────────────────────────────────
# Bug original: "o botão só toca uma vez por conexão". Causa raiz: no
# RP2350 (Pico 2W), reconfigurar a frequência de um objeto PWM que já
# está ativo (chamar pwm.freq() de novo num slice em uso) pode deixar o
# slice de PWM em estado inconsistente. Como cada toque ficava dentro
# de um try/except que só logava o erro e seguia, o buzzer parava de
# responder silenciosamente após o primeiro toque.
#
# Correção: cada vez que uma nota é tocada, o objeto PWM correspondente
# é DESLIGADO (deinit) e RECRIADO do zero antes de tocar a nova
# frequência. Isso garante que o slice de PWM sempre começa de um
# estado limpo e conhecido, eliminando o estado preso.
#
# Fluxo geral:
#   Botões (GP0–GP11) → debounce → som local (PWM) → payload JSON → MQTT
#
# Funcionalidades:
#   ✓ Leitura de 12 botões com pull-up interno (ativo em LOW)
#   ✓ Debounce por software (DEBOUNCE_MS)
#   ✓ 7 buzzers PWM (1 por tecla branca) — sustenidos reaproveitam o buzzer da branca vizinha
#   ✓ Roubo de buzzer: a última tecla pressionada que compartilha buzzer "ganha" o som
#   ✓ PWM recriado a cada toque — evita o bug de "trava depois do primeiro toque"
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
    BUZZER_PINS, NOTE_FREQ, BUZZER_DUTY,
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
        self.pin  = Pin(pin_num, Pin.IN, Pin.PULL_UP)
        self.nota = nota
        self.key  = key_num

        self._estado_anterior   = True   # True = solto, False = pressionado
        self._ultimo_tick       = 0
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

        if leitura_atual != self._estado_anterior:
            self._ultimo_tick     = agora
            self._estado_anterior = leitura_atual

        if utime.ticks_diff(agora, self._ultimo_tick) >= DEBOUNCE_MS:
            if leitura_atual != self._estado_confirmado:
                self._estado_confirmado = leitura_atual
                return "pressed" if leitura_atual == 0 else "released"

        return None


# ─── CLASSE: BUZZERS PWM (POLIFONIA POR REAPROVEITAMENTO) ────────────────────
class BuzzerPiano:
    """
    Gerencia os 7 buzzers PWM (1 por tecla branca).

    Sustenidos (teclas pretas) reaproveitam o buzzer da branca vizinha
    (get_buzzer_key). Quando duas notas que compartilham o mesmo buzzer
    são pressionadas, a última pressionada "rouba" o buzzer da anterior.

    ── PONTO-CHAVE DA CORREÇÃO ──
    Em vez de manter UM objeto PWM por buzzer durante toda a execução e
    apenas chamar .freq()/.duty_u16() repetidamente nele (o que expôs o
    bug de slice preso no RP2350), aqui o PWM é:
        1. Sempre desligado (deinit) antes de qualquer nova operação
        2. Recriado do zero (Pin + PWM) toda vez que uma nota dispara
    O custo de recriar o objeto é desprezível (microssegundos) e
    garante que cada toque comece de um estado de hardware limpo.
    """

    def __init__(self):
        # Guarda apenas o NÚMERO do pino de cada buzzer — o objeto PWM
        # em si é criado/destruído dinamicamente em tocar()/parar()
        self._pinos = dict(BUZZER_PINS)          # buzzer_key -> pin_num
        self._pwm_ativo = {}                      # buzzer_key -> PWM object ou None
        self._dono_atual = {}                     # buzzer_key -> key (int) da tecla que está soando

        for buzzer_key in self._pinos:
            self._pwm_ativo[buzzer_key] = None
            self._dono_atual[buzzer_key] = None

    def _desligar_buzzer(self, buzzer_key: str):
        """
        Desliga e destrói completamente o objeto PWM de um buzzer,
        deixando o pino limpo para a próxima operação.
        """
        pwm = self._pwm_ativo.get(buzzer_key)
        if pwm is not None:
            try:
                pwm.duty_u16(0)
                pwm.deinit()
            except Exception as e:
                print(f"[BUZZER] Aviso ao desligar {buzzer_key}: {e}")
        self._pwm_ativo[buzzer_key] = None

    def tocar(self, nota: str, key: int):
        """
        Liga o buzzer correspondente à nota, na frequência certa.
        Se o buzzer já está em uso por outra tecla, essa tecla "rouba"
        o buzzer (ex: C# rouba o buzzer de C, se C estiver soando).

        SEMPRE recria o objeto PWM do zero — essa é a correção do bug
        de "só toca uma vez".
        """
        buzzer_key = get_buzzer_key(nota)
        pin_num = self._pinos.get(buzzer_key)
        if pin_num is None:
            print(f"[BUZZER] Nota '{nota}' não tem buzzer mapeado.")
            return

        freq = NOTE_FREQ.get(nota, 440)

        try:
            # 1. Desliga qualquer PWM anterior nesse pino (estado limpo)
            self._desligar_buzzer(buzzer_key)

            # 2. Recria o PWM do zero e já aplica a frequência da nova nota
            novo_pwm = PWM(Pin(pin_num))
            novo_pwm.freq(freq)
            novo_pwm.duty_u16(BUZZER_DUTY)

            self._pwm_ativo[buzzer_key] = novo_pwm
            self._dono_atual[buzzer_key] = key

        except Exception as e:
            print(f"[BUZZER] Erro ao tocar {nota} (key={key}): {e}")
            self._pwm_ativo[buzzer_key] = None
            self._dono_atual[buzzer_key] = None

    def parar(self, nota: str, key: int):
        """
        Desliga o buzzer da nota, MAS apenas se a tecla que está soltando
        ainda for a "dona" atual do buzzer. Isso evita que soltar C#
        corte o som de C, se C tiver roubado o buzzer depois.
        """
        buzzer_key = get_buzzer_key(nota)

        if self._dono_atual.get(buzzer_key) != key:
            # Esse buzzer já foi roubado por outra tecla — não interfere
            return

        self._desligar_buzzer(buzzer_key)
        self._dono_atual[buzzer_key] = None

    def parar_tudo(self):
        """Desliga todos os buzzers — usado no shutdown e em recuperação de erro."""
        for buzzer_key in list(self._pwm_ativo.keys()):
            self._desligar_buzzer(buzzer_key)
            self._dono_atual[buzzer_key] = None


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
        try:
            self._cliente = MQTTClient(
                client_id = CLIENT_ID,
                server    = BROKER_IP,
                port      = BROKER_PORT,
                keepalive = 60
            )
            self._cliente.connect()
            self._conectado = True

            self._publicar_status("online")
            print(f"[MQTT] Conectado → {BROKER_IP}:{BROKER_PORT}")
            return True

        except Exception as e:
            print(f"[MQTT] Falha ao conectar: {e}")
            self._conectado = False
            return False

    def reconectar(self) -> bool:
        print("[MQTT] Tentando reconectar...")
        self._conectado = False
        led.value(0)

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
        { "note": "C", "key": 1, "state": "pressed", "timestamp": 1712345678 }
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
        payload = ujson.dumps({
            "client_id": CLIENT_ID,
            "status":    estado,
            "timestamp": utime.time()
        })
        try:
            self._cliente.publish(TOPIC_STATUS, payload.encode())
        except:
            pass

    def heartbeat(self):
        self._publicar_status("online")

    @property
    def conectado(self) -> bool:
        return self._conectado


# ─── INICIALIZAÇÃO DOS BOTÕES ─────────────────────────────────────────────────
def criar_botoes() -> list:
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

    # 1. Conecta Wi-Fi
    if not conectar_wifi():
        print("[MAIN] Falha crítica de Wi-Fi. Reiniciando em 10s...")
        utime.sleep(10)
        machine.reset()

    # 2. Inicializa botões e buzzers
    botoes = criar_botoes()
    print(f"[MAIN] {len(botoes)} botões configurados.")

    buzzers = BuzzerPiano()
    print("[MAIN] 7 buzzers PWM inicializados.")

    # 3. Inicializa MQTT
    mqtt = MqttPiano()
    while not mqtt.conectar():
        print(f"[MAIN] Aguardando broker MQTT em {BROKER_IP}...")
        utime.sleep(MQTT_RETRY_SEC)

    led.value(1)  # LED embutido aceso = MQTT conectado

    # 4. Variáveis de controle do heartbeat e Wi-Fi
    ultimo_heartbeat  = utime.ticks_ms()
    ultimo_check_wifi = utime.ticks_ms()
    WIFI_CHECK_MS     = 2000

    print("[MAIN] Aguardando eventos de teclado...")
    print("-" * 50)

    # ─── LOOP INFINITO ────────────────────────────────────────────────────────
    # Cada iteração roda dentro de seu próprio try/except — um erro
    # pontual (timeout de socket, GC, etc.) nunca mata o loop inteiro.
    while True:
        try:
            agora_wifi = utime.ticks_ms()
            if utime.ticks_diff(agora_wifi, ultimo_check_wifi) >= WIFI_CHECK_MS:
                ultimo_check_wifi = agora_wifi
                if not esta_conectado():
                    print("[MAIN] Wi-Fi perdido!")
                    led.value(0)
                    conectar_wifi()

            for botao in botoes:
                evento = botao.verificar()

                if evento is None:
                    continue

                # ── Som local (PWM) — SEMPRE executa, mesmo sem MQTT ──
                if evento == "pressed":
                    buzzers.tocar(botao.nota, botao.key)
                else:  # "released"
                    buzzers.parar(botao.nota, botao.key)

                # ── Publicação MQTT (best-effort; nunca bloqueia o som) ──
                sucesso = mqtt.publicar_evento(botao.nota, botao.key, evento)

                if not sucesso:
                    led.value(0)
                    if mqtt.reconectar():
                        led.value(1)
                        mqtt.publicar_evento(botao.nota, botao.key, evento)

            agora_hb = utime.ticks_ms()
            if utime.ticks_diff(agora_hb, ultimo_heartbeat) >= HEARTBEAT_SEC * 1000:
                mqtt.heartbeat()
                ultimo_heartbeat = agora_hb

        except Exception as e:
            print(f"[LOOP] Erro recuperável: {e}")
            utime.sleep_ms(50)

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
