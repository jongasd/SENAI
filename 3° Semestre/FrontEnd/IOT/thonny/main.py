import ujson
import utime
import machine
from machine import Pin, PWM
from umqtt.simple import MQTTClient

from config import (
    BROKER_IP,
    BROKER_PORT,
    CLIENT_ID,
    TOPIC_EVENTS,
    TOPIC_STATUS,
    BUTTON_MAP,
    DEBOUNCE_MS,
    HEARTBEAT_SEC,
    MQTT_RETRY_SEC,
    BUZZER_PINS,
    NOTE_FREQ,
    BUZZER_DUTY,
    get_buzzer_key
)

from WIFI_CONNECT import conectar_wifi, esta_conectado

led = Pin("LED", Pin.OUT)

class BotaoDebounce:
    def __init__(self, pin_num, nota, key):
        self.pin = Pin(pin_num, Pin.IN)
        self.nota = nota
        self.key = key
        self.estado_anterior = self.pin.value()
        self.estado_confirmado = self.estado_anterior
        self.ultimo_tick = utime.ticks_ms()

    def verificar(self):
        leitura = self.pin.value()
        agora = utime.ticks_ms()

        if leitura != self.estado_anterior:
            self.estado_anterior = leitura
            self.ultimo_tick = agora

        if utime.ticks_diff(agora, self.ultimo_tick) >= DEBOUNCE_MS:
            if leitura != self.estado_confirmado:
                self.estado_confirmado = leitura
                if leitura == 1:
                    return "pressed"
                return "released"

        return None


class PianoBuzzers:
    def __init__(self):
        self.buzzers = {}
        self.donos = {}

        for nome, pino in BUZZER_PINS.items():
            pwm = PWM(Pin(pino))
            pwm.duty_u16(0)
            self.buzzers[nome] = pwm
            self.donos[nome] = None

    def tocar(self, nota, key):
        buzzer = get_buzzer_key(nota)
        freq = NOTE_FREQ[nota]

        self.buzzers[buzzer].freq(freq)
        self.buzzers[buzzer].duty_u16(BUZZER_DUTY)
        self.donos[buzzer] = key

    def parar(self, nota, key):
        buzzer = get_buzzer_key(nota)

        if self.donos.get(buzzer) != key:
            return

        self.buzzers[buzzer].duty_u16(0)
        self.donos[buzzer] = None

    def parar_tudo(self):
        for pwm in self.buzzers.values():
            try:
                pwm.duty_u16(0)
            except:
                pass


class MqttPiano:
    def __init__(self):
        self.cliente = None
        self.conectado = False

    def conectar(self):
        try:
            self.cliente = MQTTClient(
                CLIENT_ID,
                BROKER_IP,
                port=BROKER_PORT,
                keepalive=60
            )
            self.cliente.connect()
            self.conectado = True
            self.publicar_status("online")
            print("[MQTT] conectado")
            return True
        except Exception as e:
            print("[MQTT]", e)
            self.conectado = False
            return False

    def reconectar(self):
        self.conectado = False
        try:
            self.cliente.disconnect()
        except:
            pass

        utime.sleep(MQTT_RETRY_SEC)
        return self.conectar()

    def publicar_evento(self, nota, key, estado):
        if not self.conectado:
            return False

        payload = ujson.dumps({
            "note": nota,
            "key": key,
            "state": estado,
            "timestamp": utime.time()
        })

        try:
            self.cliente.publish(TOPIC_EVENTS, payload.encode())
            print(payload)
            return True
        except Exception as e:
            print("[MQTT]", e)
            self.conectado = False
            return False

    def publicar_status(self, status):
        if not self.conectado:
            return False

        payload = ujson.dumps({
            "client_id": CLIENT_ID,
            "status": status,
            "timestamp": utime.time()
        })

        try:
            self.cliente.publish(TOPIC_STATUS, payload.encode())
            return True
        except:
            self.conectado = False
            return False


def criar_botoes():
    lista = []
    for cfg in BUTTON_MAP:
        lista.append(
            BotaoDebounce(
                cfg["pin"],
                cfg["note"],
                cfg["key"]
            )
        )
    return lista


def main():
    print("Inicializando Piano MQTT")

    if not conectar_wifi():
        print("Falha WiFi")
        utime.sleep(5)
        machine.reset()

    botoes = criar_botoes()
    piano = PianoBuzzers()
    mqtt = MqttPiano()

    while not mqtt.conectar():
        print("Aguardando Broker...")
        utime.sleep(MQTT_RETRY_SEC)

    led.value(1)
    ultimo_heartbeat = utime.ticks_ms()

    while True:
        try:
            if not esta_conectado():
                led.value(0)
                conectar_wifi()

            for botao in botoes:
                evento = botao.verificar()

                if evento is None:
                    continue

                if evento == "pressed":
                    piano.tocar(botao.nota, botao.key)
                else:
                    piano.parar(botao.nota, botao.key)

                sucesso = mqtt.publicar_evento(
                    botao.nota,
                    botao.key,
                    evento
                )

                if not sucesso:
                    led.value(0)
                    if mqtt.reconectar():
                        led.value(1)

            agora = utime.ticks_ms()
            if utime.ticks_diff(agora, ultimo_heartbeat) >= HEARTBEAT_SEC * 1000:
                mqtt.publicar_status("online")
                ultimo_heartbeat = agora

            utime.sleep_ms(1)

        except Exception as e:
            print("[ERRO]", e)
            piano.parar_tudo()
            utime.sleep_ms(50)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        led.value(0)
    except Exception as e:
        print("[FATAL]", e)
        utime.sleep(5)
        machine.reset()