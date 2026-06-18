// ════════════════════════════════════════════════════════════════
//  SMART-IRRIGATE — Caderno de Campo IoT
//  Conecta ao broker Mosquitto via MQTT.js (WebSocket)
//  Tópicos:
//    senai/irrigacao/sensores → Pico publica leituras (umidade, luz, motor)
//    senai/irrigacao/comando  → Dashboard publica comandos manuais
// ════════════════════════════════════════════════════════════════

// ────────────────────────────────────────────────────────────────────
//  Estado da aplicação
// ────────────────────────────────────────────────────────────────────
let mqttClient = null;
let isConnected = false;
let totalMessages = 0;
const MAX_LOG_ITEMS = 60;
const MAX_HISTORY_PTS = 30;
const SOIL_THRESHOLD = 30; // limiar de irrigação automática, em %

// Histórico de leituras para o gráfico (soil e light em %)
let soilHistory = [];
let lightHistory = [];

// ────────────────────────────────────────────────────────────────────
//  Aplica o selo de carimbo (OK / BAIXO / ALTO) a uma ficha de leitura
// ────────────────────────────────────────────────────────────────────
function applyStamp(stampId, level) {
  const stamp = document.getElementById(stampId);
  if (!stamp) return;
  stamp.classList.remove("ok", "low", "high");
  if (level === "ok") {
    stamp.textContent = "OK";
    stamp.classList.add("ok");
  } else if (level === "low") {
    stamp.textContent = "BAIXO";
    stamp.classList.add("low");
  } else if (level === "high") {
    stamp.textContent = "ALTO";
    stamp.classList.add("high");
  }
}

// ────────────────────────────────────────────────────────────────────
//  Atualiza a barra linear de uma ficha (substitui o gauge semicircular)
//  pct: 0–100
// ────────────────────────────────────────────────────────────────────
function updateBar(fillId, pct) {
  const fill = document.getElementById(fillId);
  if (!fill) return;
  const clamped = Math.max(0, Math.min(100, pct));
  fill.style.width = `${clamped}%`;
}

// ────────────────────────────────────────────────────────────────────
//  Atualiza a ficha de umidade do solo
// ────────────────────────────────────────────────────────────────────
function updateSoilCard(pct) {
  document.getElementById("soilValue").textContent = `${pct.toFixed(0)}%`;
  updateBar("soilBarFill", pct);

  const statusEl = document.getElementById("soilStatus");
  if (pct < SOIL_THRESHOLD) {
    statusEl.textContent = "Solo seco — irrigação necessária";
    applyStamp("soilStamp", "low");
  } else if (pct < 60) {
    statusEl.textContent = "Umidade moderada";
    applyStamp("soilStamp", "ok");
  } else {
    statusEl.textContent = "Solo bem hidratado";
    applyStamp("soilStamp", "ok");
  }

  soilHistory.push(pct);
  if (soilHistory.length > MAX_HISTORY_PTS) soilHistory.shift();
  redrawChart();
}

// ────────────────────────────────────────────────────────────────────
//  Atualiza a ficha de luminosidade
// ────────────────────────────────────────────────────────────────────
function updateLightCard(pct) {
  document.getElementById("lightValue").textContent = `${pct.toFixed(0)}%`;
  updateBar("lightBarFill", pct);

  const statusEl = document.getElementById("lightStatus");
  if (pct < 30) {
    statusEl.textContent = "Pouca luminosidade";
    applyStamp("lightStamp", "low");
  } else if (pct < 70) {
    statusEl.textContent = "Luminosidade moderada";
    applyStamp("lightStamp", "ok");
  } else {
    statusEl.textContent = "Alta luminosidade";
    applyStamp("lightStamp", "high");
  }

  lightHistory.push(pct);
  if (lightHistory.length > MAX_HISTORY_PTS) lightHistory.shift();
  redrawChart();
}

// ────────────────────────────────────────────────────────────────────
//  Atualiza o estado visual do sistema de irrigação (garrafa + furos)
// ────────────────────────────────────────────────────────────────────
function updateIrrigationState(irrigando) {
  const stateDot = document.getElementById("stateDot");
  const stateLabel = document.getElementById("stateLabel");
  const waterDrops = document.getElementById("waterDrops");
  const bottleBody = document.getElementById("bottleBody");

  if (irrigando) {
    stateDot.classList.add("active");
    stateLabel.textContent = "Irrigando agora";
    waterDrops.classList.add("dripping");
    waterDrops.style.opacity = "1";
    bottleBody.setAttribute("fill", "#cfc4a8");
  } else {
    stateDot.classList.remove("active");
    stateLabel.textContent = "Sistema parado";
    waterDrops.classList.remove("dripping");
    waterDrops.style.opacity = "0";
    bottleBody.setAttribute("fill", "#dcd2ba");
  }
}

// ────────────────────────────────────────────────────────────────────
//  Redesenha o gráfico de histórico (soil + light) como polylines SVG
//  viewBox atual: 900 x 160 (faixa larga e baixa)
// ────────────────────────────────────────────────────────────────────
function redrawChart() {
  const width = 900;
  const height = 160;
  const padding = 8;

  const toPoints = (arr) => {
    if (arr.length === 0) return "";
    const stepX = (width - padding * 2) / Math.max(arr.length - 1, 1);
    return arr
      .map((val, i) => {
        const x = padding + i * stepX;
        // Inverte porque SVG y crece para baixo; 100% = topo, 0% = base
        const y = height - padding - (val / 100) * (height - padding * 2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  };

  document
    .getElementById("soilLine")
    .setAttribute("points", toPoints(soilHistory));
  document
    .getElementById("lightLine")
    .setAttribute("points", toPoints(lightHistory));
}

// ────────────────────────────────────────────────────────────────────
//  Adiciona entrada no trilho de log (margem esquerda)
// ────────────────────────────────────────────────────────────────────
function addLogEntry(icon, text) {
  const list = document.getElementById("logList");
  const empty = document.getElementById("logEmpty");
  if (empty) empty.remove();

  const entry = document.createElement("div");
  entry.className = "log-entry";
  entry.innerHTML = `
    <span class="log-time">${formatTime(new Date())}</span>
    <span class="log-text">${icon} ${text}</span>
  `;

  list.insertBefore(entry, list.firstChild);

  while (list.children.length > MAX_LOG_ITEMS) {
    list.removeChild(list.lastChild);
  }
}

// ────────────────────────────────────────────────────────────────────
//  Atualiza o contador de mensagens na margem direita
// ────────────────────────────────────────────────────────────────────
function updateMsgCounter() {
  const el = document.getElementById("msgCounter");
  if (el) el.textContent = `${totalMessages} lidas`;
}

// ────────────────────────────────────────────────────────────────────
//  Processa mensagem MQTT recebida no tópico de sensores
//  Payload esperado:
//  {
//    "umidade_solo": 42.5,
//    "luminosidade": 78.3,
//    "motor_estado": "parado" | "irrigando",
//    "irrigando": false,
//    "timestamp": 1718745600
//  }
// ────────────────────────────────────────────────────────────────────
function handleSensorMessage(payload) {
  if (typeof payload.umidade_solo === "number") {
    updateSoilCard(payload.umidade_solo);
  }

  if (typeof payload.luminosidade === "number") {
    updateLightCard(payload.luminosidade);
  }

  if (typeof payload.irrigando === "boolean") {
    const wasIrrigating = document
      .getElementById("stateDot")
      .classList.contains("active");
    updateIrrigationState(payload.irrigando);

    // Loga apenas na transição de estado
    if (payload.irrigando && !wasIrrigating) {
      addLogEntry("💧", "Irrigação iniciada automaticamente");
    } else if (!payload.irrigando && wasIrrigating) {
      addLogEntry("✅", "Irrigação concluída — solo hidratado");
    }
  }

  addLogEntry(
    "📊",
    `Leitura: solo ${payload.umidade_solo?.toFixed(0) ?? "—"}% · luz ${payload.luminosidade?.toFixed(0) ?? "—"}%`,
  );
}

// ────────────────────────────────────────────────────────────────────
//  Processa mensagem MQTT recebida no tópico de status
// ────────────────────────────────────────────────────────────────────
function handleStatusMessage(payload) {
  if (payload.status) {
    addLogEntry("📡", `Dispositivo: ${payload.status}`);
  }
}

// ────────────────────────────────────────────────────────────────────
//  Roteador de mensagens MQTT
// ────────────────────────────────────────────────────────────────────
function handleMessage(topic, message) {
  totalMessages++;
  updateMsgCounter();

  let payload;
  try {
    payload = JSON.parse(message.toString());
  } catch (e) {
    console.warn("[MQTT] Payload inválido:", message.toString());
    return;
  }

  const sensorsTopic = document.getElementById("topicSensors").value.trim();

  if (topic === sensorsTopic) {
    handleSensorMessage(payload);
  } else if (topic.endsWith("/status")) {
    handleStatusMessage(payload);
  }

  console.log(`[MQTT] ${topic} →`, payload);
}

// ────────────────────────────────────────────────────────────────────
//  Envia comando manual (ligar/desligar) para o tópico de comando
// ────────────────────────────────────────────────────────────────────
function sendCommand(acao) {
  if (!isConnected || !mqttClient) {
    alert("Conecte ao broker MQTT antes de enviar comandos.");
    return;
  }

  const topic = document.getElementById("topicCommand").value.trim();
  const payload = JSON.stringify({
    comando: acao,
    origem: "dashboard",
    timestamp: Math.floor(Date.now() / 1000),
  });

  mqttClient.publish(topic, payload, { qos: 0 }, (err) => {
    if (err) {
      console.error("[MQTT] Erro ao publicar comando:", err);
      addLogEntry("⚠️", `Falha ao enviar comando: ${acao}`);
    } else {
      addLogEntry("🎛️", `Comando manual enviado: ${acao}`);
    }
  });
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
  const sensorsTopic = document.getElementById("topicSensors").value.trim();

  if (!ip || !port || !sensorsTopic) {
    alert("Preencha IP, Porta e Tópico de Sensores antes de conectar.");
    return;
  }

  // Sem path extra — Mosquitto aceita handshake WebSocket na raiz por padrão
  const url = `ws://${ip}:${port}`;
  console.log(`[MQTT] Conectando em ${url}...`);

  setStatus("connecting", "CONECTANDO...");
  document.getElementById("btnConnect").disabled = true;

  const clientId = `dashboard_irrigacao_${Math.random().toString(16).slice(2, 8)}`;

  mqttClient = mqtt.connect(url, {
    clientId,
    clean: true,
    connectTimeout: 5000,
    reconnectPeriod: 3000,
  });

  mqttClient.on("connect", () => {
    isConnected = true;
    setStatus("connected", "CONECTADO");

    const btn = document.getElementById("btnConnect");
    btn.textContent = "DESCONECTAR";
    btn.classList.add("disconnect");
    btn.disabled = false;

    console.log(`[MQTT] Conectado! Assinando: ${sensorsTopic}`);
    mqttClient.subscribe(sensorsTopic, { qos: 0 });

    // Assina também o tópico de status, se existir convenção /status
    const statusTopic = sensorsTopic.replace("/sensores", "/status");
    if (statusTopic !== sensorsTopic) {
      mqttClient.subscribe(statusTopic, { qos: 0 });
    }

    addLogEntry("🔌", "Conectado ao broker MQTT");
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

  addLogEntry("🔌", "Desconectado do broker MQTT");
}

// ────────────────────────────────────────────────────────────────────
//  UI helpers
// ────────────────────────────────────────────────────────────────────
function setStatus(cls, text) {
  const badge = document.getElementById("statusBadge");
  badge.className = `status-badge ${cls}`;
  document.getElementById("statusText").textContent = text;
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
updateClock();
setInterval(updateClock, 1000);
redrawChart(); // desenha grade vazia inicialmente
updateMsgCounter();
