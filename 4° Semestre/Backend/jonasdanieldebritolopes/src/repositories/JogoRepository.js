class JogoRepository {
    constructor() {
        // Banco de dados em memória
        this.jogos = [
            { id: 1, nome: "The Witcher 3", desenvolvedora: "CD Projekt Red", preco: 120.50, anoLancamento: 2015 },
            { id: 2, nome: "Elden Ring", desenvolvedora: "FromSoftware", preco: 250.00, anoLancamento: 2022 }
        ];
        this.proximoId = 3;
    }

    listarTodos() {
        return this.jogos;
    }

    buscarPorId(id) {
        return this.jogos.find(jogo => jogo.id == id);
    }

    cadastrar(dados) {
        const novoJogo = {
            id: this.proximoId++,
            nome: dados.nome,
            desenvolvedora: dados.desenvolvedora,
            preco: parseFloat(dados.preco),
            anoLancamento: parseInt(dados.anoLancamento) || null
        };
        this.jogos.push(novoJogo);
        return novoJogo;
    }

    atualizar(id, dados) {
        const index = this.jogos.findIndex(jogo => jogo.id == id);
        if (index !== -1) {
            this.jogos[index] = {
                ...this.jogos[index],
                ...dados,
                id: this.jogos[index].id // Impede a sobrescrita do ID
            };
            return this.jogos[index];
        }
        return null;
    }

    deletar(id) {
        const index = this.jogos.findIndex(jogo => jogo.id == id);
        if (index !== -1) {
            this.jogos.splice(index, 1);
        }
    }
}

module.exports = new JogoRepository();
