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

app.get("/sala", async (req, res) => {
  try {
    const salas = await queryAsync("SELECT * FROM sala");
    res.json({
      sucesso: true,
      dados: salas,
      total: salas.length,
    });
  } catch (error) {
    res.json({
      sucesso: false,
      mensagem: "Erro ao Ver Filmes",
      erro: erro.message,
    });
  }
});

app.get("/sala/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID de Sala inválido.",
      });
    }

    const salas = await queryAsync("SELECT * FROM sala WHERE id = ?", [id]);

    if (filme.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Sala não encontrada ou não existe.",
      });
    }

    res.json({
      sucesso: true,
      dados: filme[0],
    });
  } catch (error) {
    console.error("Erro ao buscar filme:", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao Buscar Filmes",
      erro: erro.message,
    });
  }
});

app.post("/sala", async (req, res) => {
  try {
    const { nome, capacidade } = req.body;
    if (!nome || !capacidade) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "O Nome e a Capacidade da Sala são Dados Obrigatórios.",
      });
    }
    if (typeof capacidade !== "number" || duracao <= 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "A Capacidade deve ser um número positivo.",
      });
    }
    const novaSala = {
      nome: nome.trim(),
      capacidade: capacidade,
    };
    const resultado = await queryAsync("INSERT INTO sala SET ?", [novaSala]);
    res.status(201).json({
      sucesso: true,
      mensagem: "Sala Criada com Sucesso.",
      id: resultado.insertId,
    });
  } catch (error) {
    console.error("Erro ao Cadastrar Sala.", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao Cadastrar Sala",
      erro: erro.message,
    });
  }
});

app.put("/sala/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, capacidade } = req.body;

    if (!id || isNaN(id)) {
      return res.status(500).json({
        sucesso: false,
        mensagem: "O Id inválido",
      });
    }
    const salaExiste = await queryAsync("SELECT * FROM sala WHERE id = ?", [
      id,
    ]);

    if (salaExiste.length === 0) {
      res.status(404).json({
        sucesso: false,
        mensagem: "Sala Não encontrada.",
      });
    }
    const salaAtualizada = {};
    if (nome !== undefined) salaAtualizada.nome = nome.trim();
    if (capacidade !== undefined) {
      if (typeof capacidade !== "number" || capacidade <= 0) {
        return res.setHeader(400).json({
          sucesso: false,
          mensagem: "A Capacidade da Sala deve ser Positiva.",
        });
      }
      salaAtualizada.capacidade = capacidade;
    }
    if (Object.keys(salaAtualizada).length === 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Nenhum Campo para Atualizar",
      });
    }
    await queryAsync("UPDATE sala SET ? WHERE id = ?", [salaAtualizada, id]);
    res.json({
      sucesso: true,
      mensagem: "Sala Atualizada",
    });
  } catch (error) {
    console.error("Erro ao Atualizar Sala:", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao Atualizar Sala",
      erro: erro.message,
    });
  }
});

app.delete("/sala/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(500).json({
        sucesso: false,
        mensagem: "ID de Salas não encontrado.",
      });
    }
    const salaExiste = await queryAsync("SELECT * FROM sala WHERE id = ?", [
      id,
    ]);

    if (salaExiste.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Sala não Encontrada.",
      });
    }
    await queryAsync("DELETE FROM sala WHERE id = ?", [id]);

    res.json({
      sucesso: true,
      mensagem: "Filme Deletado com sucesso!",
    });
  } catch (error) {
    console.error("ERRO ao Deletar Filme", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "ERRO ao Deletar Filme",
      erro: erro.message,
    });
  }
});

app.get("/sessao", async (req, res) => {
  try {
    const sessoes = await queryAsync("SELECT * FROM sessao");
    res.json({
      sucesso: true,
      dados: filmes,
      total: filmes.length,
    });
  } catch (error) {
    console.error("ERRO ao Listar Filmes", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "ERRO ao Listar Filmes",
      erro: erro.message,
    });
  }
});

app.get("/sessao/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      res.status(400).json({
        sucesso: false,
        messagem: "ID de Sessão Inválida.",
      });
    }
    const sessao = await queryAsync("SELECT * FROM sessao WHERE id = ?", [id]);
    if (sessao.length === 0) {
      res.status(404).json({
        sucesso: false,
        mensagem: "Filme não Encontrado.",
      });
    }
    res.json({
      sucesso: true,
      dados: filme[0],
    });
  } catch (error) {
    console.error("ERRO AO ENCONTRAR FILME", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "ERRO AO ENCONTRAR FILME",
      erro: erro.message,
    });
  }
});

app.post("/sessao/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { filme_id, sala_id, data_hora, preco } = req.params;

    if (!id || isNaN(id)) {
      res.status(400).json({
        sucesso: false,
        mensagem: "ID de sessão inválido",
      });
    }
    if (typeof preco !== "number" || preco <= 0) {
      res.status(400).json({
        sucesso: false,
        mensagem: "O preço tem que ser um número positivo",
      });
    }

    const novaSessao = {
      filme_id: filme_id.trim(),
      sala_id: sala_id.trim(),
      data_hora: data_hora,
      preco: preco,
    };

    const resultado = await queryAsync("INSERT INTO sessao SET ?", [
      novaSessao,
    ]);
    res.status(201).json({
      sucesso: true,
      mensagem: "Sessão Criada",
      id: resultado.insertId,
    });
  } catch (error) {
    console.error("Erro ao Criar Filme", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao Criar Filme",
      erro: erro.message,
    });
  }
});

app.put("/sessao/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { filme_id, sala_id, data_hora, preco } = req.body;
    if (!id || isNaN(id)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID de Sessão Inválida",
      });
    }
    const sessaoExiste_filme = await queryAsync(
      "SELECT * FROM filme WHERE id= ?",
      [filme_id],
    );
    if (sessaoExiste_filme.length === 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Falha ao atualizar Buscar ID de FIlme",
      });
    }
    const sessaoExiste_sala = await queryAsync(
      "SELECT * FROM sala WHERE id= ?",
      [sala_id],
    );
    if (sessaoExiste_sala.length === 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Falha ao atualizar Buscar ID de Sala",
      });
    }

    const sessaoExiste = await queryAsync("SELECT * FROM sessao WHERE id= ?", [
      id,
    ]);

    if (sessaoExiste.length == 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Sessão Não Encontrada",
      });
    }

    const sessaoAtualizada = {};

    if (filme_id !== undefined) sessaoAtualizada.filme_id = filme_id;
    if (sala_id !== undefined) sessaoAtualizada.sala_id = sala_id;
    if (data_hora !== undefined) sessaoAtualizada.data_hora = data_hora;
    if (preco !== undefined) {
      if (typeof preco !== "number" || preco <= 0) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "O preço tem que ser um número positivo",
        });
      }
      sessaoAtualizada.preco = preco;
    }
    await queryAsync("UPDATE sessao SET ? WHERE id = ?", [
      sessaoAtualizada,
      id,
    ]);

    res.json({
      sucesso: true,
      mensagem: "Sessão Atualizada com Sucesso",
    });
  } catch (error) {
    console.error("ERRO AO ATUALIZAR SESSÃO", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "ERRO AO ATUALIZAR SESSÃO",
      erro: erro.message,
    });
  }
});

app.delete("/sessao/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID da Sessão não encontrada.",
      });
    }
    const sessaoExiste_filme = await queryAsync(
      "SELECT * from filme WHERE id = ?",
      [filme_id],
    );

    if (sessaoExiste_filme.length === 0) {
      res.status(404).json({
        sucesso: false,
        mensagem: "ID do Filme não encontrado",
      });
    }
    const sessaoExiste_sala = await queryAsync(
      "SELECT * from sala WHERE id = ?"[sala_id],
    );
    if (sessaoExiste_sala.length === 0) {
      res.status(404).json({
        sucesso: false,
        mensagem: "ID da Sala não encontrada",
      });
    }
    await queryAsync("DELETE * FROM WHERE id = ?", [id]);
    res.json({
      sucesso: true,
      mensagem: "Sessão Deletada com sucesso.",
    });
  } catch (error) {
    console.error("ERRO ao DELETAR a Sessão");
    res.status(500).json({
      sucesso: false,
      mensagem: "ERRO ao DELETAR a Sessão",
      erro: erro.message,
    });
  }
});

app.get("/ingresso/", async (req, res) => {
  try {
    const ingressos = await queryAsync("SELECT * FROM ingresso");
    res.json({
      sucesso: true,
      dados: ingressos,
      total: ingressos.length,
    });
  } catch (error) {
    console.error("ERRO AO LISTAR INGRESSOS");
    res.status(500).json({
      sucesso: false,
      mensagem: "ERRO AO LISTAR INGRESSOS",
      erro: erro.message,
    });
  }
});

module.exports = app;
