class LivroRepository {
    constructor() {
        // Banco de dados em memória
        this.livros = [
            { id: 1, titulo: "Clean Code", autor: "Robert C. Martin", preco: 89.90, paginas: 424 },
            { id: 2, titulo: "O Programador Pragmático", autor: "Andrew Hunt", preco: 95.50, paginas: 352 }
        ];
        this.proximoId = 3;
    }

    listarTodos() {
        return this.livros;
    }

    buscarPorId(id) {
        return this.livros.find(livro => livro.id == id);
    }

    cadastrar(dados) {
        const novoLivro = {
            id: this.proximoId++,
            titulo: dados.titulo,
            autor: dados.autor,
            preco: parseFloat(dados.preco),
            paginas: parseInt(dados.paginas) || null
        };
        this.livros.push(novoLivro);
        return novoLivro;
    }

    atualizar(id, dados) {
        const index = this.livros.findIndex(livro => livro.id == id);
        if (index !== -1) {
            this.livros[index] = {
                ...this.livros[index],
                ...dados,
                id: this.livros[index].id // Impede a sobrescrita do ID
            };
            return this.livros[index];
        }
        return null;
    }

    deletar(id) {
        const index = this.livros.findIndex(livro => livro.id == id);
        if (index !== -1) {
            this.livros.splice(index, 1);
        }
    }
}

module.exports = new LivroRepository();
