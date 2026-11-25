require("dotenv").config();
const fs = require("fs");
const path = require("path");
const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const cookieparser = require("cookie-parser");
const Mustache = require("mustache");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieparser());

app.use((req, res, next) => {
  const metodo = String(req.body?._method || "").toUpperCase();
  if (req.method === "POST" && ["PUT", "DELETE"].includes(metodo)) {
    req.method = metodo;
  }
  next();
});

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dateStrings: true,
});

function mostrar(nome, dados = {}) {
  const arquivo = path.join(__dirname, "paginas", `${nome}.html`);
  return Mustache.render(fs.readFileSync(arquivo, "utf-8"), dados);
}

function criptografar(texto) {
  const cifra = crypto.createCipheriv(
    "aes-256-cbc",
    process.env.CRIPTO_CHAVE,
    process.env.CRIPTO_IV,
  );
  return cifra.update(texto, "utf-8", "hex") + cifra.final("hex");
}

function descriptografar(texto) {
  try {
    const decifra = crypto.createDecipheriv(
      "aes-256-cbc",
      process.env.CRIPTO_CHAVE,
      process.env.CRIPTO_IV,
    );
    return decifra.update(texto, "hex", "utf-8") + decifra.final("utf-8");
  } catch (erro) {
    return texto;
  }
}

async function excluir(res, tabela, id, volta, motivo) {
  try {
    await db.query(`DELETE FROM ${tabela} WHERE id = ?`, [id]);
    res.redirect(volta);
  } catch (erro) {
    if (erro.code === "ER_ROW_IS_REFERENCED_2") {
      return res
        .status(409)
        .send(
          `<p>Não foi possível excluir: ${motivo}</p><p><a href="${volta}">Voltar</a></p>`,
        );
    }
    console.error(erro);
    res
      .status(500)
      .send(`<p>Erro ao excluir.</p><p><a href="${volta}">Voltar</a></p>`);
  }
}

async function mostrarPlanos(req, res, erro = "") {
  const [planos] = await db.query(
    "SELECT planos_tratamento.*, pacientes.nome AS paciente_nome FROM planos_tratamento JOIN pacientes ON pacientes.id = planos_tratamento.paciente_id",
  );
  const [listaPacientes] = await db.query("SELECT id, nome FROM pacientes");
  const editar = planos.find((p) => String(p.id) === req.query.editar);

  const pacientes = listaPacientes.map((paciente) => ({
    ...paciente,
    selecionado: editar && paciente.id === editar.paciente_id ? "selected" : "",
  }));

  res.send(
    mostrar("planos", {
      planos,
      pacientes,
      erro,
      editando: Boolean(editar),
      acao: editar ? `/planos/${editar.id}` : "/planos",
      form: editar || {},
    }),
  );
}

app.get("/", (req, res) => res.send(mostrar("login")));

app.post("/login", async (req, res) => {
  const { email, senha } = req.body || {};
  if (!email || !senha) {
    return res
      .status(401)
      .send(mostrar("login", { erro: "E-mail ou senha inválidos." }));
  }

  try {
    const [usuarios] = await db.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email],
    );
    const usuario = usuarios[0];

    if (
      !usuario ||
      !usuario.senha ||
      !(await bcrypt.compare(String(senha), usuario.senha))
    ) {
      return res
        .status(401)
        .send(mostrar("login", { erro: "E-mail ou senha inválidos." }));
    }

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.cookie("token", token, { httpOnly: true });
    res.redirect("/principal");
  } catch (erro) {
    console.error(erro);
    res
      .status(500)
      .send(mostrar("login", { erro: "Erro ao realizar login." }));
  }
});

app.post("/sair", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

app.use((req, res, next) => {
  try {
    req.usuario = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    next();
  } catch (erro) {
    res.redirect("/");
  }
});

app.get("/principal", (req, res) =>
  res.send(mostrar("principal", { nome: req.usuario.nome })),
);

// =================================== PACIENTES =================================== //
app.get("/pacientes", async (req, res) => {
  const busca = req.query.busca || "";
  const [lista] = await db.query("SELECT * FROM pacientes WHERE nome LIKE ?", [
    `%${busca}%`,
  ]);
  const pacientes = lista.map((paciente) => ({
    ...paciente,
    cpf: descriptografar(paciente.cpf),
  }));

  const editar = pacientes.find(
    (paciente) => String(paciente.id) === req.query.editar,
  );

  res.send(
    mostrar("pacientes", {
      busca,
      pacientes,
      editando: Boolean(editar),
      acao: editar ? `/pacientes/${editar.id}` : "/pacientes",
      form: editar || {},
    }),
  );
});

app.post("/pacientes", async (req, res) => {
  const { nome, cpf, telefone, email, data_nascimento } = req.body;
  await db.query(
    "INSERT INTO pacientes (nome, cpf, telefone, email, data_nascimento) VALUES (?, ?, ?, ?, ?)",
    [nome, criptografar(cpf), telefone, email, data_nascimento || null],
  );
  res.redirect("/pacientes");
});

app.put("/pacientes/:id", async (req, res) => {
  const { nome, cpf, telefone, email, data_nascimento } = req.body;
  await db.query(
    "UPDATE pacientes SET nome = ?, cpf = ?, telefone = ?, email = ?, data_nascimento = ? WHERE id = ?",
    [
      nome,
      criptografar(cpf),
      telefone,
      email,
      data_nascimento || null,
      req.params.id,
    ],
  );
  res.redirect("/pacientes");
});

app.delete("/pacientes/:id", async (req, res) => {
  await excluir(
    res,
    "pacientes",
    req.params.id,
    "/pacientes",
    "O paciente já possui planos de tratamento cadastrados.",
  );
});

// =================================== PLANOS DE TRATAMENTO =================================== //
app.get("/planos", (req, res) => mostrarPlanos(req, res));

app.post("/planos", async (req, res) => {
  const { paciente_id, descricao, objetivo, qtd_sessoes } = req.body;
  if (!paciente_id) {
    return mostrarPlanos(req, res, "Paciente é obrigatório.");
  }
  await db.query(
    "INSERT INTO planos_tratamento (paciente_id, descricao, objetivo, qtd_sessoes) VALUES (?, ?, ?, ?)",
    [paciente_id, descricao, objetivo, qtd_sessoes || 1],
  );
  res.redirect("/planos");
});

app.put("/planos/:id", async (req, res) => {
  const { paciente_id, descricao, objetivo, qtd_sessoes } = req.body;
  if (!paciente_id) {
    return mostrarPlanos(req, res, "Paciente é obrigatório.");
  }
  await db.query(
    "UPDATE planos_tratamento SET paciente_id = ?, descricao = ?, objetivo = ?, qtd_sessoes = ? WHERE id = ?",
    [paciente_id, descricao, objetivo, qtd_sessoes || 1, req.params.id],
  );
  res.redirect("/planos");
});

app.delete("/planos/:id", async (req, res) => {
  await excluir(
    res,
    "planos_tratamento",
    req.params.id,
    "/planos",
    "O plano de tratamento possui sessões agendadas.",
  );
});

// =================================== SESSÕES =================================== //
app.get("/sessoes", async (req, res) => {
  const [lista] = await db.query(
    "SELECT sessoes.*, planos_tratamento.descricao AS plano_descricao, planos_tratamento.objetivo AS plano_objetivo, planos_tratamento.qtd_sessoes AS plano_qtd_sessoes, pacientes.nome AS paciente_nome, pacientes.cpf AS paciente_cpf, pacientes.telefone AS paciente_telefone, pacientes.email AS paciente_email, pacientes.data_nascimento AS paciente_data_nascimento FROM sessoes JOIN planos_tratamento ON planos_tratamento.id = sessoes.plano_id JOIN pacientes ON pacientes.id = planos_tratamento.paciente_id ORDER BY sessoes.data_sessao ASC",
  );

  const [planos] = await db.query(
    "SELECT planos_tratamento.id, planos_tratamento.descricao, pacientes.nome AS paciente_nome FROM planos_tratamento JOIN pacientes ON pacientes.id = planos_tratamento.paciente_id",
  );

  const sessoes = lista.map((s) => ({
    ...s,
    paciente_cpf: descriptografar(s.paciente_cpf),
    data_br: new Date(s.data_sessao).toLocaleString("pt-BR"),
    data_input: s.data_sessao.slice(0, 16).replace(" ", "T"),
  }));

  res.send(mostrar("sessoes", { sessoes, planos }));
});

app.post("/sessoes", async (req, res) => {
  const { plano_id, data_sessao, observacoes } = req.body;
  await db.query(
    "INSERT INTO sessoes (plano_id, data_sessao, observacoes) VALUES (?, ?, ?)",
    [plano_id, data_sessao.replace("T", " "), observacoes],
  );
  res.redirect("/sessoes");
});

app.put("/sessoes/:id", async (req, res) => {
  await db.query("UPDATE sessoes SET data_sessao = ? WHERE id = ?", [
    req.body.data_sessao.replace("T", " "),
    req.params.id,
  ]);
  res.redirect("/sessoes");
});

app.delete("/sessoes/:id", async (req, res) => {
  await excluir(res, "sessoes", req.params.id, "/sessoes", " ");
});

// =================================== SERVIDOR =================================== //
const porta = process.env.PORT || 3000;
app.listen(porta, () =>
  console.log(`Clínica de Fisioterapia rodando em http://localhost:${porta}`),
);
