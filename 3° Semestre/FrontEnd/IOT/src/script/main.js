// ────────────────────────────────────────────────────────────────────
//  Configuração das notas: nome, tipo (natural/sharp), cor
// ────────────────────────────────────────────────────────────────────
const NOTES = [
  { key: 1, name: "C", type: "natural", color: "#ff6b6b" },
  { key: 2, name: "C#", type: "sharp", color: "#ff8e53" },
  { key: 3, name: "D", type: "natural", color: "#ffd166" },
  { key: 4, name: "D#", type: "sharp", color: "#a8e063" },
  { key: 5, name: "E", type: "natural", color: "#43c59e" },
  { key: 6, name: "F", type: "natural", color: "#4ecdc4" },
  { key: 7, name: "F#", type: "sharp", color: "#45b7d1" },
  { key: 8, name: "G", type: "natural", color: "#96e6a1" },
  { key: 9, name: "G#", type: "sharp", color: "#74b9ff" },
  { key: 10, name: "A", type: "natural", color: "#a29bfe" },
  { key: 11, name: "A#", type: "sharp", color: "#fd79a8" },
  { key: 12, name: "B", type: "natural", color: "#e17055" },
];

// Mapa de nome da nota → config
const NOTE_MAP = Object.fromEntries(NOTES.map((n) => [n.name, n]));

// ────────────────────────────────────────────────────────────────────
//  Estado da aplicação
// ────────────────────────────────────────────────────────────────────
let mqttClient = null;
let isConnected = false;
let pressedKeys = new Set(); // teclas atualmente pressionadas
let totalEvents = 0;
let totalMessages = 0;
const MAX_LOG_ITEMS = 80;

// ────────────────────────────────────────────────────────────────────
//  Renderiza o teclado de piano
//  Layout: C D E F G A B (naturais) + C# D# F# G# A# (sustenidos)
// ────────────────────────────────────────────────────────────────────
function buildPiano() {
  const container = document.getElementById("pianoKeys");
  container.innerHTML = "";

  // Apenas as teclas naturais definem a grade de colunas
  const naturals = NOTES.filter((n) => n.type === "natural");
  // Índice da tecla natural (0-based) para posicionamento dos sustenidos
  const naturalIndex = {};
  let ni = 0;
  NOTES.forEach((n) => {
    if (n.type === "natural") {
      naturalIndex[n.name] = ni;
      ni++;
    }
  });

  // Cria teclas naturais
  naturals.forEach((note) => {
    const key = document.createElement("div");
    key.className = "key-natural";
    key.id = `key-${note.name.replace("#", "s")}`;
    key.dataset.note = note.name;

    const lbl = document.createElement("div");
    lbl.className = "key-label";
    lbl.textContent = note.name;
    key.appendChild(lbl);

    container.appendChild(key);
  });

  // Posições dos sustenidos (como % do total de naturais)
  // Cada sustenido fica entre dois naturais
  // C#=entre C(0) e D(1), D#=entre D(1) e E(2), F#=entre F(3) e G(4), G#=entre G(4) e A(5), A#=entre A(5) e B(6)
  const sharpPositions = { "C#": 0, "D#": 1, "F#": 3, "G#": 4, "A#": 5 };
  const totalNaturals = naturals.length; // 7

  NOTES.filter((n) => n.type === "sharp").forEach((note) => {
    const leftIdx = sharpPositions[note.name];
    // Centro do sustenido = borda direita do natural à esquerda
    // cada natural ocupa 1/7 = 14.28% da largura
    const leftPct = ((leftIdx + 1) / totalNaturals) * 100 - 7 / 2;

    const key = document.createElement("div");
    key.className = "key-sharp";
    key.id = `key-${note.name.replace("#", "s")}`;
    key.dataset.note = note.name;
    key.style.left = `${leftPct}%`;

    const lbl = document.createElement("div");
    lbl.className = "key-label";
    lbl.textContent = note.name;
    key.appendChild(lbl);

    container.appendChild(key);
  });
}

// ────────────────────────────────────────────────────────────────────
//  Atualiza a UI quando uma nota é pressionada ou solta
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
    el.style.boxShadow = `0 0 16px ${noteConf.color}88`;
  } else {
    pressedKeys.delete(noteName);
    el.classList.remove("pressed");
    // Restaura cor original baseado no tipo
    el.style.background = noteConf.type === "natural" ? "#e8e8e8" : "#1a1a1a";
    el.style.boxShadow = "";
  }

  // Atualiza contador de teclas ativas
  document.getElementById("statActive").textContent = pressedKeys.size;
}

// ────────────────────────────────────────────────────────────────────
//  Atualiza o display de nota ativa (bolha + nome grande)
// ────────────────────────────────────────────────────────────────────
function updateActiveNoteDisplay(note, state, keyNum) {
  const noteConf = NOTE_MAP[note];
  const bubble = document.getElementById("noteBubble");
  const nameLg = document.getElementById("noteNameLarge");
  const stateLbl = document.getElementById("noteStateLbl");
  const keyEl = document.getElementById("noteKeyNum");

  if (state === "pressed") {
    bubble.textContent = note;
    bubble.style.background = noteConf ? noteConf.color : "#444";
    bubble.style.color = "#000";
    bubble.classList.add("active");

    nameLg.textContent = note;
    nameLg.style.color = noteConf ? noteConf.color : "var(--text-primary)";
    nameLg.classList.add("active");

    stateLbl.textContent = "▶ PRESSIONADO";
    stateLbl.className = "note-state-label pressed";

    keyEl.textContent = `#${keyNum}`;
  } else {
    stateLbl.textContent = "◼ SOLTO";
    stateLbl.className = "note-state-label released";

    // Mantém o nome mas escurece levemente
    if (pressedKeys.size === 0) {
      nameLg.style.color = "var(--text-dim)";
    }
  }

  // Atualiza stat de última nota
  if (state === "pressed") {
    document.getElementById("statNote").textContent = note;
    document.getElementById("statNoteTime").textContent = formatTime(
      new Date(),
    );
  }
}

// ────────────────────────────────────────────────────────────────────
//  Adiciona entrada no log
// ────────────────────────────────────────────────────────────────────
function addLogEntry(payload) {
  const list = document.getElementById("logList");
  const empty = document.getElementById("logEmpty");
  if (empty) empty.remove();

  const noteConf = NOTE_MAP[payload.note];
  const color = noteConf ? noteConf.color : "#888";

  const entry = document.createElement("div");
  entry.className = "log-entry";
  entry.innerHTML = `
    <span class="log-time">${formatTime(new Date())}</span>
    <span class="log-note-badge" style="background:${color}">${payload.note}</span>
    <span class="log-state ${payload.state}">${payload.state === "pressed" ? "▶ Pressed" : "◼ Released"}</span>
    <span class="log-key">k${payload.key}</span>
  `;

  // Insere no topo
  list.insertBefore(entry, list.firstChild);

  // Limita quantidade de entradas
  while (list.children.length > MAX_LOG_ITEMS) {
    list.removeChild(list.lastChild);
  }
}

// ────────────────────────────────────────────────────────────────────
//  Processa mensagem MQTT recebida
// ────────────────────────────────────────────────────────────────────
function handleMessage(topic, message) {
  totalMessages++;
  document.getElementById("statMessages").textContent = totalMessages;

  let payload;
  try {
    payload = JSON.parse(message.toString());
  } catch (e) {
    console.warn("[MQTT] Payload inválido:", message.toString());
    return;
  }

  // Valida campos obrigatórios
  if (!payload.note || !payload.state || !payload.key) {
    console.warn("[MQTT] Payload incompleto:", payload);
    return;
  }

  totalEvents++;
  document.getElementById("statEvents").textContent = totalEvents;

  // Atualiza teclado visual
  updatePianoKey(payload.note, payload.state);

  // Atualiza display de nota ativa
  updateActiveNoteDisplay(payload.note, payload.state, payload.key);

  // Adiciona ao log
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

  const url = `ws://${ip}:${port}/mqtt`;
  console.log(`[MQTT] Conectando em ${url}...`);

  setStatus("connecting", "CONECTANDO...");
  document.getElementById("btnConnect").disabled = true;

  const clientId = `dashboard_${Math.random().toString(16).slice(2, 8)}`;

  mqttClient = mqtt.connect(url, {
    clientId,
    clean: true,
    connectTimeout: 5000,
    reconnectPeriod: 3000, // reconexão automática a cada 3s
  });

  mqttClient.on("connect", () => {
    isConnected = true;
    setStatus("connected", "CONECTADO");
    document.getElementById("btnConnect").textContent = "DESCONECTAR";
    document.getElementById("btnConnect").classList.add("disconnect");
    document.getElementById("btnConnect").disabled = false;
    console.log(`[MQTT] Conectado! Assinando: ${topic}`);
    mqttClient.subscribe(topic, { qos: 0 });

    // Também assina tópico de status do Pico
    const statusTopic = topic.replace("/events", "/status");
    mqttClient.subscribe(statusTopic, { qos: 0 });
  });

  mqttClient.on("message", (t, msg) => handleMessage(t, msg));

  mqttClient.on("reconnect", () => {
    setStatus("connecting", "RECONECTANDO...");
  });

  mqttClient.on("offline", () => {
    isConnected = false;
    setStatus("error", "OFFLINE");
  });

  mqttClient.on("error", (err) => {
    console.error("[MQTT] Erro:", err);
    setStatus("error", "ERRO");
    document.getElementById("btnConnect").disabled = false;
  });

  mqttClient.on("close", () => {
    if (isConnected) {
      isConnected = false;
      setStatus("error", "DESCONECTADO");
    }
  });
}

function disconnectMqtt() {
  if (mqttClient) {
    mqttClient.end(true);
    mqttClient = null;
  }
  isConnected = false;
  setStatus("connecting", "DESCONECTADO");
  const btn = document.getElementById("btnConnect");
  btn.textContent = "CONECTAR";
  btn.classList.remove("disconnect");
  btn.disabled = false;

  // Libera todas as teclas pressionadas
  pressedKeys.forEach((n) => updatePianoKey(n, "released"));
  pressedKeys.clear();
  document.getElementById("statActive").textContent = "0";
}

// ────────────────────────────────────────────────────────────────────
//  UI helpers
// ────────────────────────────────────────────────────────────────────
function setStatus(cls, text) {
  const badge = document.getElementById("statusBadge");
  badge.className = `status-badge ${cls}`;
  document.getElementById("statusText").textContent = text;
}

function clearLog() {
  const list = document.getElementById("logList");
  list.innerHTML =
    '<div class="log-empty" id="logEmpty">Nenhum evento recebido</div>';
  totalEvents = 0;
  totalMessages = 0;
  document.getElementById("statEvents").textContent = "0";
  document.getElementById("statMessages").textContent = "0";
}

function formatTime(d) {
  return d.toLocaleTimeString("pt-BR", { hour12: false });
}

// ────────────────────────────────────────────────────────────────────
//  Relógio no footer
// ────────────────────────────────────────────────────────────────────
function updateClock() {
  document.getElementById("footerTime").textContent = new Date().toLocaleString(
    "pt-BR",
  );
}

// ────────────────────────────────────────────────────────────────────
//  Init
// ────────────────────────────────────────────────────────────────────
buildPiano();
updateClock();
setInterval(updateClock, 1000);
