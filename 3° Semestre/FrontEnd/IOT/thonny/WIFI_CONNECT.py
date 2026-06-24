# wifi_connect.py — MIDI Keyboard IoT
# SENAI Ítalo Bologna — Curso Técnico em Desenvolvimento de Sistemas
#
# Módulo responsável pela conexão e reconexão Wi-Fi do Pico 2W.
# O Pico 2W usa o chip CYW43439 para Wi-Fi — acessado via network.WLAN.

import network
import utime
from config import WIFI_SSID, WIFI_PASS, WIFI_RETRY_SEC, MAX_WIFI_RETRIES


def conectar_wifi(ssid: str = WIFI_SSID, senha: str = WIFI_PASS) -> bool:
    """
    Conecta o Pico 2W à rede Wi-Fi.

    Tenta MAX_WIFI_RETRIES vezes antes de desistir.
    Retorna True se conectou, False caso contrário.
    """
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)

    # Já conectado? Retorna imediatamente
    if wlan.isconnected():
        print(f"[WiFi] Já conectado → {wlan.ifconfig()[0]}")
        return True

    print(f"[WiFi] Conectando em '{ssid}'...")
    wlan.connect(ssid, senha)

    tentativas = 0
    while not wlan.isconnected():
        tentativas += 1
        status = wlan.status()

        # Códigos de status do CYW43439:
        #    1 = CYW43_LINK_JOIN    → conectando
        #    2 = CYW43_LINK_NOIP    → associado mas sem IP ainda
        #    3 = CYW43_LINK_UP      → conectado com IP
        #   -1 = CYW43_LINK_FAIL    → falha de conexão
        #   -2 = CYW43_LINK_NONET   → rede não encontrada
        #   -3 = CYW43_LINK_BADAUTH → senha incorreta
        print(f"[WiFi] Aguardando... (tentativa {tentativas}/{MAX_WIFI_RETRIES}, status={status})")

        if tentativas >= MAX_WIFI_RETRIES:
            print("[WiFi] Número máximo de tentativas atingido.")
            return False

        utime.sleep(WIFI_RETRY_SEC)

    ip = wlan.ifconfig()[0]
    print(f"[WiFi] Conectado! IP: {ip}")
    return True


def esta_conectado() -> bool:
    """Verifica se o Wi-Fi ainda está ativo."""
    wlan = network.WLAN(network.STA_IF)
    return wlan.isconnected()


def obter_ip() -> str:
    """Retorna o IP atual ou string vazia se desconectado."""
    wlan = network.WLAN(network.STA_IF)
    if wlan.isconnected():
        return wlan.ifconfig()[0]
    return ""
