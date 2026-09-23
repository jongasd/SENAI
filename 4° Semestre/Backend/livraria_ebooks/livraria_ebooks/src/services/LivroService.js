const LivroRepository = require('../repositories/LivroRepository');

class LivroService {
    listarLivros() {
        return { sucesso: true, dados: LivroRepository.listarTodos() };
    }

    buscarLivroPorId(id) {
        const livro = LivroRepository.buscarPorId(id);
        if (!livro) {
            return { sucesso: false, mensagem: "Livro não encontrado" };
        }
        return { sucesso: true, dados: livro };
    }

    cadastrarLivro(dados) {
        if (!dados.titulo || !dados.autor || !dados.preco) {
            return { sucesso: false, mensagem: "Título, Autor e Preço são obrigatórios" };
        }
        const novoLivro = LivroRepository.cadastrar(dados);
        return { sucesso: true, dados: novoLivro };
    }

    atualizarLivro(id, dados) {
        const livro = LivroRepository.buscarPorId(id);
        if (!livro) {
            return { sucesso: false, mensagem: "Livro não encontrado" };
        }
        const livroAtualizado = LivroRepository.atualizar(id, dados);
        return { sucesso: true, dados: livroAtualizado };
    }

    deletarLivro(id) {
        const livro = LivroRepository.buscarPorId(id);
        if (!livro) {
            return { sucesso: false, mensagem: "Livro não encontrado" };
        }
        LivroRepository.deletar(id);
        return { sucesso: true, mensagem: "Livro deletado com sucesso" };
    }
}

module.exports = new LivroService();
