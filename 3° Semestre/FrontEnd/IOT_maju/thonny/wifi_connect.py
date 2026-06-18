import network
import time

def conectar_wifi(ssid, senha):

    wlan = network.WLAN(network.STA_IF)

    wlan.active(True)

    if wlan.isconnected():
        print("WiFi já conectado")
        return wlan

    print("Conectando ao WiFi...")

    wlan.connect(ssid, senha)

    timeout = 20

    while timeout > 0:

        if wlan.isconnected():

            print("WiFi conectado!")
            print("IP:", wlan.ifconfig()[0])

            return wlan

        timeout -= 1
        time.sleep(1)

    raise Exception("Falha ao conectar ao WiFi")