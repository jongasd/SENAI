const express = require("express");
const pool = require("./config/database");
const app = express();

app.use(express.json());

const queryAsync = (sql, values = []) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, values, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

app.get("/filmes", async (req, res) => {
  try {
    const filmes = await queryAsync("SELECT * FROM filme");
    res.json({
      sucesso: true,
      dados: filmes,
      total: filmes.length,
    });
  } catch (erro) {
    console.error("Erro ao listar filmes:", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao listar Filmes",
      erro: erro.message,
    });
  }
});

app.get("/", (req, res) => {
  res.send("API Cinema está Funcionando.");
});

app.get("/filmes/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID De Filme Inválido",
      });
    }

    const filme = await queryAsync("SELECT * FROM filme WHERE id = ?", [id]);

    if (filme.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Filme não encontrado",
      });
    }

    res.json({
      sucesso: true,
      dados: filme[0],
    });
  } catch (erro) {
    console.error("Erro ao buscar filme:", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao buscar filme",
      erro: erro.message,
    });
  }
});

app.post("/filmes", async (req, res) => {
  try {
    const { titulo, genero, duracao, classificacao, data_lancamento } =
      req.body;

    if (!titulo || !genero || !duracao) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Titulo, Genero e Duração são obrigatórios",
      });
    }

    if (typeof duracao !== "number" || duracao <= 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Duração deve ser um número positivo",
      });
    }

    const novoFilme = {
      titulo: titulo.trim(),
      genero: genero.trim(),
      duracao: duracao,
      classificacao: classificacao.trim() || null,
    };

    const resultado = await queryAsync("INSERT INTO filme SET ?", [novoFilme]);

    res.status(201).json({
      sucesso: true,
      mensagem: "Filme Criado",
      id: resultado.insertId,
    });
  } catch (erro) {
    console.error("Erro ao cadastrar filme:", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao cadastrar filme",
      erro: erro.message,
    });
  }
});

app.put("/filmes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, genero, duracao, classificacao, data_lancamento } =
      req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID De Filme Inválido",
      });
    }

    const filmeExiste = await queryAsync("SELECT * FROM filme WHERE id = ?", [
      id,
    ]);

    if (filmeExiste.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Filme não Encontrado",
      });
    }

    const filmeAtualizado = {};

    if (titulo !== undefined) filmeAtualizado.titulo = titulo.trim();
    if (genero !== undefined) filmeAtualizado.genero = genero.trim();
    if (duracao !== undefined) {
      if (typeof duracao !== "number" || duracao <= 0) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Duração deve ser um número positivo",
        });
      }
      filmeAtualizado.duracao = duracao;
    }

    if (classificacao !== undefined)
      filmeAtualizado.classificacao = classificacao.trim();
    if (data_lancamento !== undefined)
      filmeAtualizado.data_lancamento = data_lancamento;
    if (Object.keys(filmeAtualizado).length === 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Nenhum campo para Atualizar",
      });
    }
    await queryAsync("UPDATE filme SET ? WHERE id = ?", [filmeAtualizado, id]);
    res.json({
      sucesso: true,
      mensagem: "Filme Atualizado",
    });
  } catch (erro) {
    console.error("Erro ao atualizar filme:", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao atualizar filme",
      erro: erro.message,
    });
  }
});
app.delete("/filmes/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID De Filme Inválido",
      });
    }

    const filmeExiste = await queryAsync("SELECT * FROM filme WHERE id = ?", [
      id,
    ]);

    if (filmeExiste.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Filme não Encontrado",
      });
    }

    await queryAsync("DELETE FROM filme WHERE id = ?", [id]);

    res.json({
      sucesso: true,
      mensagem: "Filme apagado com sucesso!",
    });
  } catch (erro) {
    console.error("Erro ao apagar o Filme:", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao apagar o filme",
      erro: erro.message,
    });
  }
});
