const NOTAS = [
  { tecla: 1, nome: "C", tipo: "natural", cor: "#ff6b6b" },
  { tecla: 2, nome: "C#", tipo: "sharp", cor: "#ff8e53" },
  { tecla: 3, nome: "D", tipo: "natural", cor: "#ffd166" },
  { tecla: 4, nome: "D#", tipo: "sharp", cor: "#a8e063" },
  { tecla: 5, nome: "E", tipo: "natural", cor: "#43c59e" },
  { tecla: 6, nome: "F", tipo: "natural", cor: "#4ecdc4" },
  { tecla: 7, nome: "F#", tipo: "sharp", cor: "#45b7d1" },
  { tecla: 8, nome: "G", tipo: "natural", cor: "#96e6a1" },
  { tecla: 9, nome: "G#", tipo: "sharp", cor: "#74b9ff" },
  { tecla: 10, nome: "A", tipo: "natural", cor: "#a29bfe" },
  { tecla: 11, nome: "A#", tipo: "sharp", cor: "#fd79a8" },
  { tecla: 12, nome: "B", tipo: "natural", cor: "#e17055" },
];

const MAPA_NOTAS = Object.fromEntries(NOTAS.map((n) => [n.nome, n]));

let clienteMqtt = null;
let estaConectado = false;
let teclasPressionadas = new Set();
let totalEventos = 0;
let totalMensagens = 0;
const MAX_ITENS_LOG = 80;

function construirPiano() {
  const recipiente = document.getElementById("pianoKeys");
  recipiente.innerHTML = "";

  const naturais = NOTAS.filter((n) => n.tipo === "natural");
  const indiceNatural = {};
  let inat = 0;
  NOTAS.forEach((n) => {
    if (n.tipo === "natural") {
      indiceNatural[n.nome] = inat;
      inat++;
    }
  });

  naturais.forEach((nota) => {
    const tecla = document.createElement("div");
    tecla.className = "key-natural";
    tecla.id = `key-${nota.nome.replace("#", "s")}`;
    tecla.dataset.note = nota.nome;

    const rotulo = document.createElement("div");
    rotulo.className = "key-label";
    rotulo.textContent = nota.nome;
    tecla.appendChild(rotulo);

    recipiente.appendChild(tecla);
  });

  const posicoesSustenidos = { "C#": 0, "D#": 1, "F#": 3, "G#": 4, "A#": 5 };
  const totalNaturais = naturais.length;

  NOTAS.filter((n) => n.tipo === "sharp").forEach((nota) => {
    const idxEsquerda = posicoesSustenidos[nota.nome];
    const pctEsquerda = ((idxEsquerda + 1) / totalNaturais) * 100 - 7 / 2;

    const tecla = document.createElement("div");
    tecla.className = "key-sharp";
    tecla.id = `key-${nota.nome.replace("#", "s")}`;
    tecla.dataset.note = nota.nome;
    tecla.style.left = `${pctEsquerda}%`;

    const rotulo = document.createElement("div");
    rotulo.className = "key-label";
    rotulo.textContent = nota.nome;
    tecla.appendChild(rotulo);

    recipiente.appendChild(tecla);
  });
}

function atualizarTeclaPiano(nomeNota, estado) {
  const nomeSeguro = nomeNota.replace("#", "s");
  const el = document.getElementById(`key-${nomeSeguro}`);
  const confNota = MAPA_NOTAS[nomeNota];
  if (!el || !confNota) return;

  if (estado === "pressed") {
    teclasPressionadas.add(nomeNota);
    el.classList.add("pressed");
    el.style.background = confNota.cor;
    el.style.boxShadow = `0 0 16px ${confNota.cor}88`;
  } else {
    teclasPressionadas.delete(nomeNota);
    el.classList.remove("pressed");
    el.style.background = confNota.tipo === "natural" ? "#e8e8e8" : "#1a1a1a";
    el.style.boxShadow = "";
  }

  document.getElementById("statActive").textContent = teclasPressionadas.size;
}

function atualizarExibicaoNotaAtiva(nota, estado, numTecla) {
  const confNota = MAPA_NOTAS[nota];
  const bolha = document.getElementById("noteBubble");
  const nomeGrande = document.getElementById("noteNameLarge");
  const rotuloEstado = document.getElementById("noteStateLbl");
  const elTecla = document.getElementById("noteKeyNum");

  if (estado === "pressed") {
    bolha.textContent = nota;
    bolha.style.background = confNota ? confNota.cor : "#444";
    bolha.style.color = "#000";
    bolha.classList.add("active");

    nomeGrande.textContent = nota;
    nomeGrande.style.color = confNota ? confNota.cor : "var(--text-primary)";
    nomeGrande.classList.add("active");

    rotuloEstado.textContent = "▶ PRESSIONADO";
    rotuloEstado.className = "note-state-label pressed";

    elTecla.textContent = `#${numTecla}`;
  } else {
    rotuloEstado.textContent = "◼ SOLTO";
    rotuloEstado.className = "note-state-label released";

    if (teclasPressionadas.size === 0) {
      nomeGrande.style.color = "var(--text-dim)";
    }
  }

  if (estado === "pressed") {
    document.getElementById("statNote").textContent = nota;
    document.getElementById("statNoteTime").textContent = formatarTempo(
      new Date(),
    );
  }
}

function adicionarEntradaLog(carga) {
  const lista = document.getElementById("logList");
  const vazio = document.getElementById("logEmpty");
  if (vazio) vazio.remove();

  const confNota = MAPA_NOTAS[carga.note];
  const cor = confNota ? confNota.cor : "#888";

  const entrada = document.createElement("div");
  entrada.className = "log-entry";
  entrada.innerHTML = `
    <span class="log-time">${formatarTempo(new Date())}</span>
    <span class="log-note-badge" style="background:${cor}">${carga.note}</span>
    <span class="log-state ${carga.state}">${carga.state === "pressed" ? "▶ Pressed" : "◼ Released"}</span>
    <span class="log-key">k${carga.key}</span>
  `;

  lista.insertBefore(entrada, lista.firstChild);

  while (lista.children.length > MAX_ITENS_LOG) {
    lista.removeChild(lista.lastChild);
  }
}

function tratarMensagem(topico, mensagem) {
  totalMensagens++;
  document.getElementById("statMessages").textContent = totalMensagens;

  let carga;
  try {
    carga = JSON.parse(mensagem.toString());
  } catch (e) {
    console.warn("[MQTT] Payload inválido:", mensagem.toString());
    return;
  }

  if (!carga.note || !carga.state || !carga.key) {
    console.warn("[MQTT] Payload incompleto:", carga);
    return;
  }

  totalEventos++;
  document.getElementById("statEvents").textContent = totalEventos;

  atualizarTeclaPiano(carga.note, carga.state);

  atualizarExibicaoNotaAtiva(carga.note, carga.state, carga.key);

  adicionarEntradaLog(carga);

  console.log(`[MQTT] ${topico} →`, carga);
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
  const topico = document.getElementById("topicInput").value.trim();

  if (!ip || !porta || !topico) {
    alert("Preencha IP, Porta e Tópico antes de conectar.");
    return;
  }

  const url = `ws://${ip}:${porta}/mqtt`;
  console.log(`[MQTT] Conectando em ${url}...`);

  definirStatus("connecting", "CONECTANDO...");
  document.getElementById("btnConnect").disabled = true;

  const idCliente = `dashboard_${Math.random().toString(16).slice(2, 8)}`;

  clienteMqtt = mqtt.connect(url, {
    clientId: idCliente,
    clean: true,
    connectTimeout: 5000,
    reconnectPeriod: 3000,
  });

  clienteMqtt.on("connect", () => {
    estaConectado = true;
    definirStatus("connected", "CONECTADO");
    document.getElementById("btnConnect").textContent = "DESCONECTAR";
    document.getElementById("btnConnect").classList.add("disconnect");
    document.getElementById("btnConnect").disabled = false;
    console.log(`[MQTT] Conectado! Assinando: ${topico}`);
    clienteMqtt.subscribe(topico, { qos: 0 });

    const topicoStatus = topico.replace("/events", "/status");
    clienteMqtt.subscribe(topicoStatus, { qos: 0 });
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

  teclasPressionadas.forEach((n) => atualizarTeclaPiano(n, "released"));
  teclasPressionadas.clear();
  document.getElementById("statActive").textContent = "0";
}

function definirStatus(cls, texto) {
  const indicador = document.getElementById("statusBadge");
  indicador.className = `status-badge ${cls}`;
  document.getElementById("statusText").textContent = texto;
}

function limparLog() {
  const lista = document.getElementById("logList");
  lista.innerHTML =
    '<div class="log-empty" id="logEmpty">Nenhum evento recebido</div>';
  totalEventos = 0;
  totalMensagens = 0;
  document.getElementById("statEvents").textContent = "0";
  document.getElementById("statMessages").textContent = "0";
}

function formatarTempo(d) {
  return d.toLocaleTimeString("pt-BR", { hour12: false });
}

function atualizarRelogio() {
  document.getElementById("footerTime").textContent = new Date().toLocaleString(
    "pt-BR",
  );
}

construirPiano();
atualizarRelogio();
setInterval(atualizarRelogio, 1000);
