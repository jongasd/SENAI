# config.py — MIDI Keyboard IoT
# SENAI Ítalo Bologna — Curso Técnico em Desenvolvimento de Sistemas
#
# ⚠️ Configure antes de gravar no Pico:
#   BROKER_IP  → IP do notebook que roda o Mosquitto (use ipconfig)
#   CLIENT_ID  → nome único do grupo (ex: pico_grupo1)
#
# Topologia MQTT:
#   senai/grupo1/piano/events  → Pico publica eventos de tecla
#   senai/grupo1/piano/status  → Pico publica heartbeat de status

# ── Wi-Fi ─────────────────────────────────────────────────────────────────────
WIFI_SSID   = "WIFI_IOT"
WIFI_PASS   = "Ac1ce2ss5@IOT"

# ── MQTT Broker ───────────────────────────────────────────────────────────────
BROKER_IP   = "10.132.112.3"        # ← IP do notebook broker (ipconfig)
BROKER_PORT = 1883                    # TCP direto — porta para o Pico

# ── Identidade do dispositivo ─────────────────────────────────────────────────
CLIENT_ID   = "pico_grupo1"          # ← nome único do grupo/dispositivo

# ── Tópicos MQTT ──────────────────────────────────────────────────────────────
TOPIC_EVENTS = "senai/grupo3/piano/events"   # Pico publica: pressed / released
TOPIC_STATUS = "senai/grupo3/piano/status"   # Pico publica: heartbeat online/offline

# ── Mapeamento GPIO → Nota Musical ────────────────────────────────────────────
# Pinos GP seguros no Pico 2W (evita GP23/GP24/GP25 — internos do WiFi chip)
# Botões ligados entre o pino GP e GND — usa pull-up interno (lógica invertida)
#
# Botão  Nota   Pino GP
#   1     C      GP0
#   2     C#     GP1
#   3     D      GP2
#   4     D#     GP3
#   5     E      GP4
#   6     F      GP5
#   7     F#     GP6
#   8     G      GP7
#   9     G#     GP8
#  10     A      GP9
#  11     A#     GP10
#  12     B      GP11

BUTTON_MAP = [
    {"key": 1,  "note": "C",  "pin": 0},
    {"key": 2,  "note": "C#", "pin": 1},
    {"key": 3,  "note": "D",  "pin": 2},
    {"key": 4,  "note": "D#", "pin": 3},
    {"key": 5,  "note": "E",  "pin": 4},
    {"key": 6,  "note": "F",  "pin": 5},
    {"key": 7,  "note": "F#", "pin": 6},
    {"key": 8,  "note": "G",  "pin": 7},
    {"key": 9,  "note": "G#", "pin": 8},
    {"key": 10, "note": "A",  "pin": 9},
    {"key": 11, "note": "A#", "pin": 10},
    {"key": 12, "note": "B",  "pin": 11},
]

# ── Parâmetros de comportamento ────────────────────────────────────────────────
DEBOUNCE_MS      = 30     # Tempo de debounce em milissegundos
HEARTBEAT_SEC    = 30     # Intervalo do heartbeat de status (segundos)
WIFI_RETRY_SEC   = 5      # Espera entre tentativas de reconexão Wi-Fi
MQTT_RETRY_SEC   = 3      # Espera entre tentativas de reconexão MQTT
MAX_WIFI_RETRIES = 10     # Tentativas máximas de Wi-Fi antes de reiniciar
# config.py — MIDI Keyboard IoT
# SENAI Ítalo Bologna — Curso Técnico em Desenvolvimento de Sistemas

# ─── BUZZERS (1 por tecla branca — 7 buzzers) ──────────────────────────────
# Cada tecla branca tem seu próprio buzzer dedicado.
BUZZER_PINS = {
    "C": 16,
    "D": 17,
    "E": 18,
    "F": 19,
    "G": 20,
    "A": 21,
    "B": 22,
}

# ─── SUSTENIDOS (teclas pretas) → reaproveitam o buzzer da branca vizinha ──
# Regra: C# usa o buzzer de C, D# usa o de D, F# usa o de F,
#        G# usa o de G, A# usa o de A.
# (não existem D#... espera, existem D# e A#; não existem buzzers próprios
#  para nenhum sustenido — todos reaproveitam.)
SHARP_TO_WHITE = {
    "C#": "C",
    "D#": "D",
    "F#": "F",
    "G#": "G",
    "A#": "A",
}

def get_buzzer_key(nota: str) -> str:
    """
    Retorna a 'chave de buzzer' (nome da tecla branca) que uma nota deve usar.
    Notas brancas retornam a si mesmas; sustenidos retornam a branca vizinha.
    """
    return SHARP_TO_WHITE.get(nota, nota)


# ─── FREQUÊNCIAS (oitava 4 — valores padrão em Hz) ─────────────────────────
# Sustenidos usam a frequência real deles (mais aguda que a branca do buzzer),
# mesmo compartilhando o buzzer físico da branca vizinha.
NOTE_FREQ = {
    "C":  261,
    "C#": 277,
    "D":  294,
    "D#": 311,
    "E":  329,
    "F":  349,
    "F#": 370,
    "G":  392,
    "G#": 415,
    "A":  440,
    "A#": 466,
    "B":  494,
}


# ─── LED RGB (compartilhado — cor muda conforme a nota) ────────────────────
RGB_PINS = {
    "R": 13,
    "G": 14,
    "B": 15,
}

# Cor (R, G, B) de 0–255 para cada nota. Sustenidos têm uma variação mais
# clara/saturada da cor da branca correspondente.
NOTE_COLORS = {
    "C":  (255, 0,   0),
    "C#": (255, 90,  90),
    "D":  (255, 140, 0),
    "D#": (255, 180, 90),
    "E":  (255, 255, 0),
    "F":  (0,   255, 0),
    "F#": (90,  255, 140),
    "G":  (0,   200, 255),
    "G#": (90,  220, 255),
    "A":  (60,  60,  255),
    "A#": (140, 140, 255),
    "B":  (200, 0,   255),
}

LED_OFF = (0, 0, 0)


