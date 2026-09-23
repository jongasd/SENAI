const JogoRepository = require('../repositories/JogoRepository');

class JogoService {
    listarJogos() {
        return { sucesso: true, dados: JogoRepository.listarTodos() };
    }

    buscarJogoPorId(id) {
        const jogo = JogoRepository.buscarPorId(id);
        if (!jogo) {
            return { sucesso: false, mensagem: "Jogo não encontrado" };
        }
        return { sucesso: true, dados: jogo };
    }

    cadastrarJogo(dados) {
        if (!dados.nome || !dados.desenvolvedora || !dados.preco) {
            return { sucesso: false, mensagem: "Nome, Desenvolvedora e Preço são obrigatórios" };
        }
        const novoJogo = JogoRepository.cadastrar(dados);
        return { sucesso: true, dados: novoJogo };
    }

    atualizarJogo(id, dados) {
        const jogo = JogoRepository.buscarPorId(id);
        if (!jogo) {
            return { sucesso: false, mensagem: "Jogo não encontrado" };
        }
        const jogoAtualizado = JogoRepository.atualizar(id, dados);
        return { sucesso: true, dados: jogoAtualizado };
    }

    deletarJogo(id) {
        const jogo = JogoRepository.buscarPorId(id);
        if (!jogo) {
            return { sucesso: false, mensagem: "Jogo não encontrado" };
        }
        JogoRepository.deletar(id);
        return { sucesso: true, mensagem: "Jogo deletado com sucesso" };
    }
}

module.exports = new JogoService();
