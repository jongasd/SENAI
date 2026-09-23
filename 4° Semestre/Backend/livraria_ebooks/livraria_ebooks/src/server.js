const app = require('./app');

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor da Livraria rodando na porta ${PORT}`);
});
