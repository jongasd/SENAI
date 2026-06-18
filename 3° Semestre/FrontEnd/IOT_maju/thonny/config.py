# =========================
# WIFI
# =========================

WIFI_SSID = "Rede_Irrigacao"
WIFI_PASSWORD = "SuaSenha"

# =========================
# MQTT
# =========================

MQTT_BROKER = "10.132.106.3"
MQTT_PORT = 1883

MQTT_CLIENT_ID = "pico2w_irrigacao"

TOPIC_SENSORES = b"senai/irrigacao/sensores"
TOPIC_COMANDO = b"senai/irrigacao/comando"
TOPIC_STATUS = b"senai/irrigacao/status"

# =========================
# REGRAS DE IRRIGAÇÃO
# =========================

UMIDADE_MINIMA = 35
LUMINOSIDADE_MINIMA = 20

# Tempo entre leituras (segundos)

TEMPO_LEITURA = 5