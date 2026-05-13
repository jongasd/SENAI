import express from "express";

const app = express();
app.use(express.json());

const livros = [
  {
    isbn: 1,
    titulo_livro: "Teste0101",
    editora_livro: "Saber",
    ano_publicacao: "2000",
  },
  {
    isbn: 2,
    titulo_livro: "Como desalmar uma alma",
    editora_livro: "Cemitério",
    ano_publicacao: "100",
  },
];

function buscarLivro(isbn) {
  return livros.findIndex((livro) => {
    return livro.isbn === Number(isbn);
  });
}

app.get("/", (req, res) => {
  res.status(200).send("Teste");
});

app.get("/livros", (req, res) => {
  res.status(200).json(livros);
});
app.get("/livros/:isbn", (req, res) => {
  const index = buscarLivro(req.params.isbn);
  res.status(200).json(livros[index]);
});

app.post("/livros", (req, res) => {
  livros.push(req.body);
  res.status(201).json(req.body);
});
app.put("/livros/:isbn", (req, res) => {
  const index = buscarLivro(req.params.isbn);
  livros[index].titulo_livro = req.body.titulo_livro;
  livros[index].editora_livro = req.body.editora_livro;
  livros[index].ano_publicacao = req.body.ano_publicacao;
  res.status(200).json(livros[index]);
});
app.delete("/livros/:isbn", (req, res) => {
  const index = buscarLivro(req.params.isbn);
  livros.splice(index, 1);
  res.status(200).send("Livro removido");
});

// --------------------------------

const autor = [
  {
    id_autor: 1,
    nome_autor: "Clarice Lispector",
    nacionalidade: "Brasileira",
  },
  {
    id_autor: 2,
    nome_autor: "George Orwell",
    nacionalidade: "Britânico",
  },
];

function buscarAutor(id_autor) {
  return autor.findIndex((auto) => {
    return auto.id_autor === Number(id_autor);
  });
}

app.get("/autor", (req, res) => {
  res.status(200).json(autor);
});

app.get("/autor/:id_autor", (req, res) => {
  const index = buscarAutor(req.params.id_autor);
  res.status(200).json(autor[index]);
});

app.post("/autor", (req, res) => {
  autor.push(req.body);
  res.status(201).json(req.body);
});

app.put("/autor/:id_autor", (req, res) => {
  const index = buscarAutor(req.params.id_autor);
  autor[index].nome_autor = req.body.nome_autor;
  autor[index].nacionalidade = req.body.nacionalidade;
  res.status(200).json(autor[index]);
});

app.delete("/autor/:id_autor", (req, res) => {
  const index = buscarAutor(req.params.id_autor);
  autor.splice(index, 1);
  res.status(200).send("Autor removido");
});

// --------------------------------------

const autor_livros = [
  {
    isbn: 101,
    id_autor: "101",
    quantidade_livro: 10,
  },
];

function buscarAutor_livro(isbn) {
  return autor_livros.findIndex((autor_livro) => {
    return autor_livro.isbn === Number(isbn);
  });
}

app.get("/autor_livros", (req, res) => {
  res.status(200).json(autor_livros);
});
app.get("/autor_livros/:isbn", (req, res) => {
  const index = buscarAutor_livro(req.params.isbn);
  res.status(200).json(autor_livros[index]);
});

app.post("/autor_livros", (req, res) => {
  autor_livros.push(req.body);
  res.status(201).json(req.body);
});
app.put("/autor_livros/:isbn", (req, res) => {
  const index = buscarAutor_livro(req.params.isbn);
  autor_livros[index].quantidade_livro = req.body.quantidade_livro;

  res.status(200).json([index]);
});
app.delete("/autor_livros/:isbn", (req, res) => {
  const index = buscarAutor_livro(req.params.isbn);
  autor_livros.splice(index, 1);
  res.status(200).send("Quantidade removida");
});

// ------------------------

const exemplar = [
  {
    id_exemplar: 2,
    isbn: 105,
    status_exemplar: "Emprestado",
  },
];

function buscarExemplar(id_exemplar) {
  return exemplar.findIndex((exemplars) => {
    return exemplars.id_exemplar === Number(id_exemplar);
  });
}

app.get("/exemplar", (req, res) => {
  res.status(200).json(exemplar);
});
app.get("/exemplar/:id_exemplar", (req, res) => {
  const index = buscarExemplar(req.params.id_exemplar);
  res.status(200).json(exemplar[index]);
});

app.post("/exemplar", (req, res) => {
  exemplar.push(req.body);
  res.status(201).json(req.body);
});
app.put("/exemplar/:id_exemplar", (req, res) => {
  const index = buscarExemplar(req.params.id_exemplar);
  exemplar[index].status_exemplar = req.body.status_exemplar;
  res.status(200).json(exemplar[index]);
});
app.delete("/exemplar/:id_exemplar", (req, res) => {
  const index = buscarExemplar(req.params.id_exemplar);
  exemplar.splice(index, 1);
  res.status(200).send("Exemplar removido");
});

// --------------------------------------
const membros = [
    {
        matricula_aluno: 1125002212,
        nome_completo: "Jonas Daniel de Brito Lopes",
        endereco_aluno: "É la!",
        telefone_contato: "11 93301-2244"
    }
]

function buscarMembros(matricula_aluno) {
  return membros.findIndex((membro) => {
    return membro.matricula_aluno === Number(matricula_aluno);
  });
}

app.get("/membros", (req, res) => {
  res.status(200).json(membros);
});
app.get("/membros/:matricula_aluno", (req, res) => {
  const index = buscarMembros(req.params.matricula_aluno);
  res.status(200).json(membros[index]);
});

app.post("/membros", (req, res) => {
  membros.push(req.body);
  res.status(201).json(req.body);
});
app.put("/membros/:matricula_aluno", (req, res) => {
  const index = buscarMembros(req.params.matricula_aluno);
  membros[index].nome_completo = req.body.nome_completo;
  membros[index].endereco_aluno = req.body.endereco_aluno;
  membros[index].telefone_contato = req.body.telefone_contato;
  res.status(200).json(membros[index]);
});
app.delete("/membros/:matricula_aluno", (req, res) => {
  const index = buscarMembros(req.params.matricula_aluno);
  membros.splice(index, 1);
  res.status(200).send("Membro Removido");
});

// ---------------------------------------

const emprestimo = [
    {
        id_emprestimo: 101,
        matricula_aluno: 1125002310,
        id_exemplar: 192,
        data_emprestimo: "03/02/3000",
        data_devolucao: "03/04/3002",
        data_devolucao_real: null 
    }
]

function buscarEmprestimo(id_emprestimo) {
  return emprestimo.findIndex((emprest) => {
    return emprest.id_emprestimo === Number(id_emprestimo);
  });
}
app.get("/emprestimo", (req, res) => {
  res.status(200).json(emprestimo);
});

app.get("/emprestimo/:id_emprestimo", (req, res) => {
  const index = buscarEmprestimo(req.params.id_emprestimo);
  res.status(200).json(emprestimo[index]);
});

app.post("/emprestimo", (req, res) => {
  emprestimo.push(req.body);
  res.status(201).json(req.body);
});
app.put("/emprestimo/:id_emprestimo", (req, res) => {
  const index = buscarEmprestimo(req.params.id_emprestimo);
  emprestimo[index].matricula_aluno = req.body.matricula_aluno;
  emprestimo[index].id_exemplar = req.body.id_exemplar;
  emprestimo[index].data_emprestimo = req.body.data_emprestimo;
  emprestimo[index].data_devolucao = req.body.data_devolucao;
  if (emprestimo[index].data_devolucao_real != null){
    emprestimo[index].data_devolucao_real = req.body.data_devolucao_real
  }
  res.status(200).json(emprestimo[index]);
});
app.delete("/emprestimo/:id_emprestimo", (req, res) => {
  const index = buscarEmprestimo(req.params.id_emprestimo);
  emprestimo.splice(index, 1);
  res.status(200).send("Emprestimo Removido");
});



export default app;

import app from "./src/script/app.js"

const PORT = 3003
app.listen(PORT, () => {console.log("Servidor Rodando!!")})

