//Exercício 1
class AppError extends Error {
  constructor(mensagem, statusCode = 500) {
    super(mensagem);
    this.statusCode = statusCode;
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}

const CAMPOS_OBRIGATORIOS_CRIACAO = ["cliente", "valor"];

const validarExistencia = (resultado, res, tipo) => {
  if (resultado.length === 0) {
    return res.status(404).json({
      sucesso: false,
      mensagem: `${tipo} não encontrado.`,
    });
    return false;
  }
  return true;
};
const validarCamposObrigatorios = (dados) => {
  const faltando = CAMPOS_OBRIGATORIOS_CRIACAO.filter(
    (campo) =>
      dados[campo] === undefined ||
      dados[campo] === null ||
      dados[campo] === "",
  );
  if (typeof valor !== "number" || valor <= 0) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "Valor não é um número ou é negativo.",
    });
  }
};
const parseId = (id) => {
  const parsed = Number(id);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new AppError("ID inválido", 400);
  }
  return parsed;
};
const CAMPOS_ATUALIZAVEIS = ["cliente", "valor"];
app.get("/usuario", async (req, res) => {
  try {
    const selecionarUsuarios = await queryAsync("SELECT * FROM usuario");
    res.send(selecionarUsuarios, "TOTAL:", selecionarUsuarios.length);
  } catch (error) {
    res.status(500).json({
      sucesso: false,
      mensagem: error.message,
    });
  }
});

app.get("/usuario/:id", async (req, res) => {
  try {
    const idValido = parseId(id);
    const selecionarUsuariosPorId = await queryAsync(
      "SELECT * FROM usuario WHERE id = ?",
      [id],
    );

    if (!validarExistencia(usuario, res, "Usuario")) {
      return;
    }
    res.json({
      sucesso: true,
      dados: selecionarUsuariosPorId[0],
    });
  } catch (error) {
    res.status(500).json({
      sucesso: false,
      mensagem: "ERRO ao Selecionar Usuario",
      erro: error.message,
    });
  }
});

//Exercício 2

app.post("/pedidos", async (req, res) => {
  try {
    validarCamposObrigatorios(req.body);

    const novoPedido = {
      cliente: cliente.trim(),
      valor: Number(valor),
    };
    const resultado = await queryAsync("INSERT INTO pedido SET ?", [
      novoPedido,
    ]);

    res.json({
      sucesso: true,
      mensagem: "Pedido Criado",
      id: resultado.insertId,
    });
  } catch (error) {
    res.status(500).json({
      sucesso: false,
      mensagem: "ERRO ao Criar Pedido",
      erro: error.message,
    });
  }
});

//Exercício 3

app.put("/salas/:id", async (req, res) => {
  try {
    const idValido = parseId(id);
    validarCamposObrigatorios(req.body);
    validarExistencia(salas, res, "Salas");
    const salaExiste = await queryAsync("SELECT * FROM sala WHERE id = ?", [
      id,
    ]);
    const novaSala = {};

    if (Object.keys(novaSala).length === 0)
      return res.status(400).json({
        sucesso: false,
        mensagem: "Nenhum Campo para Atualizar",
      });

    await queryAsync("UPDATE sala SET ? WHERE id = ?", [dados, id]);

    res.json({
      sucesso: true,
      mensagem: "Sala Atualizada.",
    });
  } catch (error) {
    res.status(500).json({
      sucesso: false,
      mensagem: "ERRO ao Atualizar Sala",
      erro: error.message,
    });
  }
});

app.delete("/salas/:id", async (req, res) => {
  try {
    const idValido = parseId(id);
    const salaExiste = await queryAsync("SELECT * FROM sala WHERE id = ?", [
      id,
    ]);
    validarExistencia(salas, res, "Salas");

    await queryAsync("DELETE FROM sala WHERE id = ?", [id]);

    res.json({
      sucesso: true,
      mensagem: "Sala Deletada",
    });
  } catch (error) {
    res.status(500).json({
      sucesso: false,
      mensagem: "ERRO ao Deletar Sala",
    });
  }
});
