// ════════════════════════════════════════════════════════════════
//  SENAI MIDI Piano — Dashboard IoT (tema Material You Dark)
//  Conecta ao broker Mosquitto via MQTT.js (WebSocket)
//  Tópico esperado: senai/grupo1/piano/events
//  Payload:
//  { "note": "C", "key": 1, "state": "pressed", "timestamp": 1718745600 }
// ════════════════════════════════════════════════════════════════

// ────────────────────────────────────────────────────────────────────
//  Configuração das notas: nome, tipo (natural/sharp), cor
// ────────────────────────────────────────────────────────────────────
const NOTES = [
  { key: 1, name: "C", type: "natural", color: "#ff5351" },
  { key: 2, name: "C#", type: "sharp", color: "#ffa726" },
  { key: 3, name: "D", type: "natural", color: "#fdd835" },
  { key: 4, name: "D#", type: "sharp", color: "#4caf50" },
  { key: 5, name: "E", type: "natural", color: "#00bcd4" },
  { key: 6, name: "F", type: "natural", color: "#2196f3" },
  { key: 7, name: "F#", type: "sharp", color: "#673ab7" },
  { key: 8, name: "G", type: "natural", color: "#e91e63" },
  { key: 9, name: "G#", type: "sharp", color: "#84cfff" },
  { key: 10, name: "A", type: "natural", color: "#eac339" },
  { key: 11, name: "A#", type: "sharp", color: "#ffb3ae" },
  { key: 12, name: "B", type: "natural", color: "#009ad7" },
];

const NOTE_MAP = Object.fromEntries(NOTES.map((n) => [n.name, n]));

// ────────────────────────────────────────────────────────────────────
//  Estado da aplicação
// ────────────────────────────────────────────────────────────────────
let mqttClient = null;
let isConnected = false;
let pressedKeys = new Set();
let totalEvents = 0;
let totalMessages = 0;
const MAX_LOG_ITEMS = 60;

// ────────────────────────────────────────────────────────────────────
//  Renderiza o teclado — 7 naturais ocupando a largura + 5 sustenidos
//  flutuando sobre as junções, igual a um piano real
// ────────────────────────────────────────────────────────────────────
function buildPiano() {
  const container = document.getElementById("pianoKeys");
  container.innerHTML = "";
  container.style.position = "relative";

  const naturals = NOTES.filter((n) => n.type === "natural");
  const totalNaturals = naturals.length; // 7

  naturals.forEach((note) => {
    const key = document.createElement("div");
    key.className = "piano-key-glow key-natural";
    key.id = `key-${note.name.replace("#", "s")}`;
    key.dataset.note = note.name;
    key.dataset.color = note.color;

    const lbl = document.createElement("div");
    lbl.className = "key-label";
    lbl.textContent = note.name;
    key.appendChild(lbl);

    container.appendChild(key);
  });

  // Posição de cada sustenido = entre dois naturais específicos
  const sharpPositions = { "C#": 0, "D#": 1, "F#": 3, "G#": 4, "A#": 5 };

  NOTES.filter((n) => n.type === "sharp").forEach((note) => {
    const leftIdx = sharpPositions[note.name];
    const leftPct = ((leftIdx + 1) / totalNaturals) * 100 - 7 / 2;

    const key = document.createElement("div");
    key.className = "piano-key-glow key-sharp";
    key.id = `key-${note.name.replace("#", "s")}`;
    key.dataset.note = note.name;
    key.dataset.color = note.color;
    key.style.left = `${leftPct}%`;

    const lbl = document.createElement("div");
    lbl.className = "key-label";
    lbl.textContent = note.name;
    key.appendChild(lbl);

    container.appendChild(key);
  });
}

// ────────────────────────────────────────────────────────────────────
//  Atualiza a tecla visual quando pressionada/solta
// ────────────────────────────────────────────────────────────────────
function updatePianoKey(noteName, state) {
  const safeName = noteName.replace("#", "s");
  const el = document.getElementById(`key-${safeName}`);
  const noteConf = NOTE_MAP[noteName];
  if (!el || !noteConf) return;

  if (state === "pressed") {
    pressedKeys.add(noteName);
    el.classList.add("pressed");
    el.style.background = noteConf.color;
    el.style.boxShadow = `0 0 40px ${noteConf.color}88, 0 0 90px ${noteConf.color}44`;
    spawnParticle(el, noteConf.color);
  } else {
    pressedKeys.delete(noteName);
    el.classList.remove("pressed");
    el.style.background = "";
    el.style.boxShadow = "";
  }

  document.getElementById("statActive").textContent = pressedKeys.size;
}

// ────────────────────────────────────────────────────────────────────
//  Partícula flutuante decorativa ao pressionar uma tecla
// ────────────────────────────────────────────────────────────────────
function spawnParticle(element, color) {
  const particle = document.createElement("div");
  particle.className =
    "fixed rounded-full pointer-events-none transition-all duration-1000 z-50";
  const rect = element.getBoundingClientRect();
  particle.style.width = "16px";
  particle.style.height = "16px";
  particle.style.left = `${rect.left + rect.width / 2 - 8}px`;
  particle.style.top = `${rect.top}px`;
  particle.style.backgroundColor = color;
  particle.style.boxShadow = `0 0 16px ${color}`;

  document.body.appendChild(particle);

  requestAnimationFrame(() => {
    particle.style.transform = "translateY(-160px) scale(0)";
    particle.style.opacity = "0";
  });

  setTimeout(() => particle.remove(), 1000);
}

// ────────────────────────────────────────────────────────────────────
//  Atualiza o card de "Nota Ativa"
// ────────────────────────────────────────────────────────────────────
function updateActiveNoteDisplay(note, state, keyNum) {
  const noteConf = NOTE_MAP[note];
  const bubble = document.getElementById("noteBubble");
  const nameLg = document.getElementById("noteNameLarge");
  const stateLbl = document.getElementById("noteStateLbl");
  const keyEl = document.getElementById("noteKeyNum");
  const badge = document.getElementById("activeBadge");

  if (state === "pressed") {
    bubble.textContent = note;
    bubble.style.background = noteConf ? noteConf.color : "#353534";
    bubble.style.color = "#131313";
    bubble.style.borderColor = "transparent";

    nameLg.textContent = note;
    nameLg.style.color = noteConf ? noteConf.color : "#e5e2e1";

    stateLbl.textContent = "▶ Pressionado";
    stateLbl.style.color = "#84cfff";

    keyEl.textContent = `#${keyNum}`;

    badge.textContent = "Recebendo entrada";
    badge.classList.remove(
      "bg-tertiary/20",
      "text-tertiary",
      "border-tertiary/30",
    );
    badge.classList.add(
      "bg-secondary-container/20",
      "text-secondary",
      "border-secondary/30",
    );
  } else {
    stateLbl.textContent = "◼ Solto";
    stateLbl.style.color = "#eac339";

    if (pressedKeys.size === 0) {
      badge.textContent = "Aguardando entrada";
      badge.classList.remove(
        "bg-secondary-container/20",
        "text-secondary",
        "border-secondary/30",
      );
      badge.classList.add(
        "bg-tertiary/20",
        "text-tertiary",
        "border-tertiary/30",
      );
    }
  }
}

// ────────────────────────────────────────────────────────────────────
//  Adiciona entrada no log de eventos (estilo "session card")
// ────────────────────────────────────────────────────────────────────
function addLogEntry(payload) {
  const list = document.getElementById("logList");
  const empty = document.getElementById("logEmpty");
  if (empty) empty.remove();

  const noteConf = NOTE_MAP[payload.note];
  const color = noteConf ? noteConf.color : "#888";
  const stateClass = payload.state === "pressed" ? "pressed" : "released";
  const stateText = payload.state === "pressed" ? "▶ Pressed" : "◼ Released";

  const entry = document.createElement("div");
  entry.className = "log-entry";
  entry.innerHTML = `
    <div class="log-note-chip" style="background:${color}">${payload.note}</div>
    <div class="log-entry-text">
      <p class="log-entry-state ${stateClass}">${stateText}</p>
      <p class="log-entry-meta">Tecla ${payload.key} · ${formatTime(new Date())}</p>
    </div>
  `;

  list.insertBefore(entry, list.firstChild);

  while (list.children.length > MAX_LOG_ITEMS) {
    list.removeChild(list.lastChild);
  }

  // Pulso visual no indicador "live"
  const dot = document.getElementById("liveDot");
  dot.classList.add("active");
  clearTimeout(window._liveDotTimeout);
  window._liveDotTimeout = setTimeout(
    () => dot.classList.remove("active"),
    1500,
  );
}

// ────────────────────────────────────────────────────────────────────
//  Processa mensagem MQTT recebida
// ────────────────────────────────────────────────────────────────────
function handleMessage(topic, message) {
  totalMessages++;
  document.getElementById("statMessages").textContent = totalMessages;
  document.getElementById("statMessagesTop").textContent =
    `${totalMessages} msgs`;

  let payload;
  try {
    payload = JSON.parse(message.toString());
  } catch (e) {
    console.warn("[MQTT] Payload inválido:", message.toString());
    return;
  }

  if (!payload.note || !payload.state || !payload.key) {
    console.warn("[MQTT] Payload incompleto:", payload);
    return;
  }

  totalEvents++;
  document.getElementById("statEvents").textContent = totalEvents;

  updatePianoKey(payload.note, payload.state);
  updateActiveNoteDisplay(payload.note, payload.state, payload.key);
  addLogEntry(payload);

  console.log(`[MQTT] ${topic} →`, payload);
}

// ────────────────────────────────────────────────────────────────────
//  Gerenciamento da conexão MQTT
// ────────────────────────────────────────────────────────────────────
function toggleConnection() {
  if (isConnected) {
    disconnectMqtt();
  } else {
    connectMqtt();
  }
}

function connectMqtt() {
  const ip = document.getElementById("brokerIp").value.trim();
  const port = parseInt(document.getElementById("brokerPort").value.trim());
  const topic = document.getElementById("topicInput").value.trim();

  if (!ip || !port || !topic) {
    alert("Preencha IP, Porta e Tópico antes de conectar.");
    return;
  }

  // Sem path extra — Mosquitto aceita handshake WebSocket na raiz por padrão
  const url = `ws://${ip}:${port}`;
  console.log(`[MQTT] Conectando em ${url}...`);

  setStatus("connecting", "Conectando...");
  document.getElementById("btnConnect").disabled = true;

  const clientId = `dashboard_${Math.random().toString(16).slice(2, 8)}`;

  mqttClient = mqtt.connect(url, {
    clientId,
    clean: true,
    connectTimeout: 5000,
    reconnectPeriod: 3000,
  });

  mqttClient.on("connect", () => {
    isConnected = true;
    setStatus("connected", "Conectado");

    const btn = document.getElementById("btnConnect");
    btn.textContent = "Desconectar";
    btn.classList.add("btn-disconnect");
    btn.disabled = false;

    console.log(`[MQTT] Conectado! Assinando: ${topic}`);
    mqttClient.subscribe(topic, { qos: 0 });

    const statusTopic = topic.replace("/events", "/status");
    mqttClient.subscribe(statusTopic, { qos: 0 });
  });

  mqttClient.on("message", (t, msg) => handleMessage(t, msg));

  mqttClient.on("reconnect", () => setStatus("connecting", "Reconectando..."));

  mqttClient.on("offline", () => {
    isConnected = false;
    setStatus("error", "Offline");
  });

  mqttClient.on("error", (err) => {
    console.error("[MQTT] Erro:", err);
    setStatus("error", "Erro de conexão");
    document.getElementById("btnConnect").disabled = false;
  });

  mqttClient.on("close", () => {
    if (isConnected) {
      isConnected = false;
      setStatus("error", "Desconectado");
    }
  });
}

function disconnectMqtt() {
  if (mqttClient) {
    mqttClient.end(true);
    mqttClient = null;
  }
  isConnected = false;
  setStatus("connecting", "Desconectado");

  const btn = document.getElementById("btnConnect");
  btn.textContent = "Conectar";
  btn.classList.remove("btn-disconnect");
  btn.disabled = false;

  pressedKeys.forEach((n) => updatePianoKey(n, "released"));
  pressedKeys.clear();
  document.getElementById("statActive").textContent = "0";
}

// ────────────────────────────────────────────────────────────────────
//  UI helpers
// ────────────────────────────────────────────────────────────────────
function setStatus(kind, text) {
  const icon = document.getElementById("connIcon");
  const txt = document.getElementById("statusText");

  icon.classList.remove("connected", "error");
  if (kind === "connected") {
    icon.textContent = "wifi";
    icon.classList.add("connected");
  } else if (kind === "error") {
    icon.textContent = "wifi_off";
    icon.classList.add("error");
  } else {
    icon.textContent = "wifi_protected_setup";
  }

  txt.textContent = text;
}

function clearLog() {
  const list = document.getElementById("logList");
  list.innerHTML = `
    <div class="text-center py-10 text-on-surface-variant/40 font-label-sm text-sm" id="logEmpty">
      Nenhum evento recebido
    </div>`;
  totalEvents = 0;
  totalMessages = 0;
  document.getElementById("statEvents").textContent = "0";
  document.getElementById("statMessages").textContent = "0";
  document.getElementById("statMessagesTop").textContent = "0 msgs";
}

function formatTime(d) {
  return d.toLocaleTimeString("pt-BR", { hour12: false });
}

// ────────────────────────────────────────────────────────────────────
//  Init
// ────────────────────────────────────────────────────────────────────
buildPiano();
