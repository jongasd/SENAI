let clienteMqtt = null;
let estaConectado = false;
let totalMensagens = 0;
const MAX_ITENS_LOG = 60;
const MAX_PONTOS_HISTORICO = 30;
const LIMITE_SOLO = 30;

let historicoSolo = [];
let historicoLuz = [];

function aplicarCarimbo(idCarimbo, nivel) {
  const carimbo = document.getElementById(idCarimbo);
  if (!carimbo) return;
  carimbo.classList.remove("ok", "low", "high");
  if (nivel === "ok") {
    carimbo.textContent = "OK";
    carimbo.classList.add("ok");
  } else if (nivel === "low") {
    carimbo.textContent = "BAIXO";
    carimbo.classList.add("low");
  } else if (nivel === "high") {
    carimbo.textContent = "ALTO";
    carimbo.classList.add("high");
  }
}

function atualizarBarra(idPreenchimento, pct) {
  const preenchimento = document.getElementById(idPreenchimento);
  if (!preenchimento) return;
  const limitado = Math.max(0, Math.min(100, pct));
  preenchimento.style.width = `${limitado}%`;
}

function atualizarCartaoSolo(pct) {
  document.getElementById("soilValue").textContent = `${pct.toFixed(0)}%`;
  atualizarBarra("soilBarFill", pct);

  const elStatus = document.getElementById("soilStatus");
  if (pct < LIMITE_SOLO) {
    elStatus.textContent = "Solo seco — irrigação necessária";
    aplicarCarimbo("soilStamp", "low");
  } else if (pct < 60) {
    elStatus.textContent = "Umidade moderada";
    aplicarCarimbo("soilStamp", "ok");
  } else {
    elStatus.textContent = "Solo bem hidratado";
    aplicarCarimbo("soilStamp", "ok");
  }

  historicoSolo.push(pct);
  if (historicoSolo.length > MAX_PONTOS_HISTORICO) historicoSolo.shift();
  redesenharGrafico();
}

function atualizarCartaoLuz(pct) {
  document.getElementById("lightValue").textContent = `${pct.toFixed(0)}%`;
  atualizarBarra("lightBarFill", pct);

  const elStatus = document.getElementById("lightStatus");
  if (pct < 30) {
    elStatus.textContent = "Pouca luminosidade";
    aplicarCarimbo("lightStamp", "low");
  } else if (pct < 70) {
    elStatus.textContent = "Luminosidade moderada";
    aplicarCarimbo("lightStamp", "ok");
  } else {
    elStatus.textContent = "Alta luminosidade";
    aplicarCarimbo("lightStamp", "high");
  }

  historicoLuz.push(pct);
  if (historicoLuz.length > MAX_PONTOS_HISTORICO) historicoLuz.shift();
  redesenharGrafico();
}
function atualizarEstadoIrrigacao(irrigando) {
  const pontoEstado = document.getElementById("stateDot");
  const rotuloEstado = document.getElementById("stateLabel");
  const gotasAgua = document.getElementById("waterDrops");
  const corpoGarrafa = document.getElementById("bottleBody");

  if (irrigando) {
    pontoEstado.classList.add("active");
    rotuloEstado.textContent = "Irrigando agora";
    gotasAgua.classList.add("dripping");
    gotasAgua.style.opacity = "1";
    corpoGarrafa.setAttribute("fill", "#cfc4a8");
  } else {
    pontoEstado.classList.remove("active");
    rotuloEstado.textContent = "Sistema parado";
    gotasAgua.classList.remove("dripping");
    gotasAgua.style.opacity = "0";
    corpoGarrafa.setAttribute("fill", "#dcd2ba");
  }
}

function redesenharGrafico() {
  const largura = 900;
  const altura = 160;
  const preenchimentoEspaco = 8;

  const paraPontos = (arr) => {
    if (arr.length === 0) return "";
    const passoX =
      (largura - preenchimentoEspaco * 2) / Math.max(arr.length - 1, 1);
    return arr
      .map((val, i) => {
        const x = preenchimentoEspaco + i * passoX;
        // Inverte porque SVG y crece para baixo; 100% = topo, 0% = base
        const y =
          altura -
          preenchimentoEspaco -
          (val / 100) * (altura - preenchimentoEspaco * 2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  };

  document
    .getElementById("soilLine")
    .setAttribute("points", paraPontos(historicoSolo));
  document
    .getElementById("lightLine")
    .setAttribute("points", paraPontos(historicoLuz));
}

function adicionarEntradaLog(icone, texto) {
  const lista = document.getElementById("logList");
  const vazio = document.getElementById("logEmpty");
  if (vazio) vazio.remove();

  const entrada = document.createElement("div");
  entrada.className = "log-entry";
  entrada.innerHTML = `
    <span class="log-time">${formatarTempo(new Date())}</span>
    <span class="log-text">${icone} ${texto}</span>
  `;

  lista.insertBefore(entrada, lista.firstChild);

  while (lista.children.length > MAX_ITENS_LOG) {
    lista.removeChild(lista.lastChild);
  }
}

function atualizarContadorMsg() {
  const el = document.getElementById("msgCounter");
  if (el) el.textContent = `${totalMensagens} lidas`;
}

function tratarMensagemSensor(carga) {
  if (typeof carga.umidade_solo === "number") {
    atualizarCartaoSolo(carga.umidade_solo);
  }

  if (typeof carga.luminosidade === "number") {
    atualizarCartaoLuz(carga.luminosidade);
  }

  if (typeof carga.irrigando === "boolean") {
    const estavaIrrigando = document
      .getElementById("stateDot")
      .classList.contains("active");
    atualizarEstadoIrrigacao(carga.irrigando);

    // Loga apenas na transição de estado
    if (carga.irrigando && !estavaIrrigando) {
      adicionarEntradaLog("💧", "Irrigação iniciada automaticamente");
    } else if (!carga.irrigando && estavaIrrigando) {
      adicionarEntradaLog("✅", "Irrigação concluída — solo hidratado");
    }
  }

  adicionarEntradaLog(
    "📊",
    `Leitura: solo ${carga.umidade_solo?.toFixed(0) ?? "—"}% · luz ${carga.luminosidade?.toFixed(0) ?? "—"}%`,
  );
}

function tratarMensagemStatus(carga) {
  if (carga.status) {
    adicionarEntradaLog("📡", `Dispositivo: ${carga.status}`);
  }
}

function tratarMensagem(topico, mensagem) {
  totalMensagens++;
  atualizarContadorMsg();

  let carga;
  try {
    carga = JSON.parse(mensagem.toString());
  } catch (e) {
    console.warn("[MQTT] Payload inválido:", mensagem.toString());
    return;
  }

  const topicoSensores = document.getElementById("topicSensors").value.trim();

  if (topico === topicoSensores) {
    tratarMensagemSensor(carga);
  } else if (topico.endsWith("/status")) {
    tratarMensagemStatus(carga);
  }

  console.log(`[MQTT] ${topico} →`, carga);
}

function enviarComando(acao) {
  if (!estaConectado || !clienteMqtt) {
    alert("Conecte ao broker MQTT antes de enviar comandos.");
    return;
  }

  const topico = document.getElementById("topicCommand").value.trim();
  const carga = JSON.stringify({
    comando: acao,
    origem: "dashboard",
    timestamp: Math.floor(Date.now() / 1000),
  });

  clienteMqtt.publish(topico, carga, { qos: 0 }, (err) => {
    if (err) {
      console.error("[MQTT] Erro ao publicar comando:", err);
      adicionarEntradaLog("⚠️", `Falha ao enviar comando: ${acao}`);
    } else {
      adicionarEntradaLog("🎛️", `Comando manual enviado: ${acao}`);
    }
  });
}

function alternarConexao() {
  if (estaConectado) {
    desconectarMqtt();
  } else {
    conectarMqtt();
  }
}

function conectarMqtt() {
  const ip = document.getElementById("brokerIp").value.trim();
  const porta = parseInt(document.getElementById("brokerPort").value.trim());
  const topicoSensores = document.getElementById("topicSensors").value.trim();

  if (!ip || !porta || !topicoSensores) {
    alert("Preencha IP, Porta e Tópico de Sensores antes de conectar.");
    return;
  }

  const url = `ws://${ip}:${porta}`;
  console.log(`[MQTT] Conectando em ${url}...`);

  definirStatus("connecting", "CONECTANDO...");
  document.getElementById("btnConnect").disabled = true;

  const idCliente = `dashboard_irrigacao_${Math.random().toString(16).slice(2, 8)}`;

  clienteMqtt = mqtt.connect(url, {
    clientId: idCliente,
    clean: true,
    connectTimeout: 5000,
    reconnectPeriod: 3000,
  });

  clienteMqtt.on("connect", () => {
    estaConectado = true;
    definirStatus("connected", "CONECTADO");

    const btn = document.getElementById("btnConnect");
    btn.textContent = "DESCONECTAR";
    btn.classList.add("disconnect");
    btn.disabled = false;

    console.log(`[MQTT] Conectado! Assinando: ${topicoSensores}`);
    clienteMqtt.subscribe(topicoSensores, { qos: 0 });

    // Assina também o tópico de status, se existir convenção /status
    const topicoStatus = topicoSensores.replace("/sensores", "/status");
    if (topicoStatus !== topicoSensores) {
      clienteMqtt.subscribe(topicoStatus, { qos: 0 });
    }

    adicionarEntradaLog("🔌", "Conectado ao broker MQTT");
  });

  clienteMqtt.on("message", (t, msg) => tratarMensagem(t, msg));

  clienteMqtt.on("reconnect", () => {
    definirStatus("connecting", "RECONECTANDO...");
  });

  clienteMqtt.on("offline", () => {
    estaConectado = false;
    definirStatus("error", "OFFLINE");
  });

  clienteMqtt.on("error", (err) => {
    console.error("[MQTT] Erro:", err);
    definirStatus("error", "ERRO");
    document.getElementById("btnConnect").disabled = false;
  });

  clienteMqtt.on("close", () => {
    if (estaConectado) {
      estaConectado = false;
      definirStatus("error", "DESCONECTADO");
    }
  });
}

function desconectarMqtt() {
  if (clienteMqtt) {
    clienteMqtt.end(true);
    clienteMqtt = null;
  }
  estaConectado = false;
  definirStatus("connecting", "DESCONECTADO");

  const btn = document.getElementById("btnConnect");
  btn.textContent = "CONECTAR";
  btn.classList.remove("disconnect");
  btn.disabled = false;

  adicionarEntradaLog("🔌", "Desconectado do broker MQTT");
}

function definirStatus(cls, texto) {
  const indicador = document.getElementById("statusBadge");
  indicador.className = `status-badge ${cls}`;
  document.getElementById("statusText").textContent = texto;
}

function formatarTempo(d) {
  return d.toLocaleTimeString("pt-BR", { hour12: false });
}

function atualizarRelogio() {
  document.getElementById("footerTime").textContent = new Date().toLocaleString(
    "pt-BR",
  );
}

atualizarRelogio();
setInterval(atualizarRelogio, 1000);
redesenharGrafico();
atualizarContadorMsg();
