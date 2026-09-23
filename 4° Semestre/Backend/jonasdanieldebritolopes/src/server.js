const app = require('./app');

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Servidor da Loja de Jogos rodando na porta ${PORT}`);
});
