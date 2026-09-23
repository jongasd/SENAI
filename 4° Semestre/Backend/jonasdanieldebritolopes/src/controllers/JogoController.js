const JogoService = require('../services/JogoService');

class JogoController {
    listar(req, res) {
        const resultado = JogoService.listarJogos();
        res.json(resultado);
    }

    buscarPorId(req, res) {
        const resultado = JogoService.buscarJogoPorId(req.params.id);
        if(!resultado.sucesso) {
            return res.status(404).json(resultado);
        }
        res.json(resultado);
    }

    cadastrar(req, res) {
        const resultado = JogoService.cadastrarJogo(req.body);
        if(!resultado.sucesso) {
            return res.status(400).json(resultado);
        }
        res.status(201).json(resultado);
    }

    atualizar(req, res) {
        const resultado = JogoService.atualizarJogo(req.params.id, req.body);
        if(!resultado.sucesso) {
            return res.status(404).json(resultado);
        }
        res.json(resultado);
    }

    deletar(req, res) {
        const resultado = JogoService.deletarJogo(req.params.id);
        if(!resultado.sucesso) {
            return res.status(404).json(resultado);
        }
        res.status(204).send();
    }
}

module.exports = new JogoController();
