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
    const index = buscarLivro(req.params.isbn)
    res.status(200).json(livros[index])
});

app.post('/livros', (req, res)=>{
  livros.push(req.body)
  res.status(201).json(req.body)
})
app.put('/livros/:isbn', (req, res)=>{
const index = buscarLivro(req.params.isbn)
livros[index].titulo_livro = req.body.titulo_livro
livros[index].editora_livro = req.body.editora_livro
livros[index].ano_publicacao = req.body.ano_publicacao
res.status(200).json(livros[index])
})
app.delete('/livros/:isbn', (req, res) => {
const index = buscarLivro(req.params.isbn)
livros.splice(index,1)
res.status(200).send('Livro removido')
})
export default app;

// mongodb+srv://jonasdlopes_db_user:<Senh@105>@cluster0.y96x3ea.mongodb.net/?appName=Cluster0