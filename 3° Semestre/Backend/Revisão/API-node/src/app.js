import express from "express";

const app = express();
app.use(express.json());

const msc = [
  {
    id: 123,
    titulo: "B.Y.O.B",
    artista: "SOAD",
    genero: "Rock",
    "ano-pub": "1709",
  },
];

function buscarMusica(id) {
  return musicas.findIndex((m) => {
    return m.id == Number(id);
  });
}

app.get("/musicas/:id", (req, res) => {
   const index = buscarMusica(req.params.id)
    res.status(200).json(musica[index])
})
export default app;
