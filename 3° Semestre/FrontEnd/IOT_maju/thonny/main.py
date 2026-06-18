from machine import Pin
from machine import ADC
from machine import PWM

from umqttsimple import MQTTClient

import json
import time

import config

from wifi_connect import conectar_wifi


# =====================================
# HARDWARE
# =====================================

# FC-28

sensor_solo = ADC(26)

# LDR

ldr = ADC(27)

# SG90

servo = PWM(Pin(16))
servo.freq(50)

# =====================================
# VARIÁVEIS GLOBAIS
# =====================================

cliente = None

irrigando = False


# =====================================
# SERVO
# =====================================

def mover_servo(angulo):

    duty = int(
        1638 +
        (angulo / 180) * 6553
    )

    servo.duty_u16(duty)


# =====================================
# LEITURA UMIDADE SOLO
# =====================================

def ler_umidade_solo():

    valor = sensor_solo.read_u16()

    porcentagem = 100 - (
        (valor / 65535) * 100
    )

    return round(porcentagem, 1)


# =====================================
# LEITURA LDR
# =====================================

def ler_luminosidade():

    valor = ldr.read_u16()

    porcentagem = (
        valor / 65535
    ) * 100

    return round(porcentagem, 1)


# =====================================
# STATUS MQTT
# =====================================

def publicar_status(status):

    global cliente

    payload = {

        "status": status

    }

    cliente.publish(
        config.TOPIC_STATUS,
        json.dumps(payload)
    )


# =====================================
# INICIAR IRRIGAÇÃO
# =====================================

def iniciar_irrigacao():

    global irrigando

    if irrigando:
        return

    irrigando = True

    mover_servo(180)

    publicar_status(
        "Irrigando"
    )

    print(
        "Irrigação iniciada"
    )


# =====================================
# PARAR IRRIGAÇÃO
# =====================================

def parar_irrigacao():

    global irrigando

    if not irrigando:
        return

    irrigando = False

    mover_servo(0)

    publicar_status(
        "Parado"
    )

    print(
        "Irrigação parada"
    )


# =====================================
# PUBLICAR SENSORES
# =====================================

def publicar_sensores():

    global cliente

    umidade = ler_umidade_solo()

    luminosidade = ler_luminosidade()

    payload = {

        "umidade_solo": umidade,

        "luminosidade": luminosidade,

        "irrigando": irrigando,

        "motor_estado":
            "irrigando"
            if irrigando
            else "parado",

        "timestamp":
            int(time.time())

    }

    cliente.publish(

        config.TOPIC_SENSORES,

        json.dumps(payload)

    )

    print(payload)


# =====================================
# MQTT CALLBACK
# =====================================

def receber_mensagem(topic, msg):

    try:

        print(
            "Mensagem recebida:"
        )

        print(msg)

        dados = json.loads(msg)

        comando = dados.get(
            "comando"
        )

        if comando == "ligar":

            iniciar_irrigacao()

        elif comando == "desligar":

            parar_irrigacao()

    except Exception as erro:

        print(
            "Erro MQTT:",
            erro
        )


# =====================================
# MQTT
# =====================================

def conectar_mqtt():

    global cliente

    cliente = MQTTClient(

        config.MQTT_CLIENT_ID,

        config.MQTT_BROKER,

        port=config.MQTT_PORT

    )

    cliente.set_callback(
        receber_mensagem
    )

    cliente.connect()

    cliente.subscribe(
        config.TOPIC_COMANDO
    )

    publicar_status(
        "Online"
    )

    print(
        "MQTT conectado"
    )


# =====================================
# LÓGICA AUTOMÁTICA
# =====================================

def logica_automatica():

    umidade = ler_umidade_solo()

    luminosidade = ler_luminosidade()

    print(
        "Umidade:",
        umidade,
        "%"
    )

    print(
        "Luminosidade:",
        luminosidade,
        "%"
    )

    if (

        umidade <
        config.UMIDADE_MINIMA

        and

        luminosidade >
        config.LUMINOSIDADE_MINIMA

    ):

        iniciar_irrigacao()

    else:

        parar_irrigacao()


# =====================================
# MAIN
# =====================================

print(
    "SMART IRRIGATE"
)

conectar_wifi(

    config.WIFI_SSID,

    config.WIFI_PASSWORD

)

conectar_mqtt()

mover_servo(0)

while True:

    try:

        cliente.check_msg()

        logica_automatica()

        publicar_sensores()

        time.sleep(
            config.TEMPO_LEITURA
        )

    except Exception as erro:

        print(
            "Erro:",
            erro
        )

        time.sleep(5)