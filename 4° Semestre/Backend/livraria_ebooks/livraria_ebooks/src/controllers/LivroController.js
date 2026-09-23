const LivroService = require('../services/LivroService');

class LivroController {
    listar(req, res) {
        const resultado = LivroService.listarLivros();
        res.json(resultado);
    }

    buscarPorId(req, res) {
        const resultado = LivroService.buscarLivroPorId(req.params.id);
        if(!resultado.sucesso) {
            return res.status(404).json(resultado);
        }
        res.json(resultado);
    }

    cadastrar(req, res) {
        /*  #swagger.parameters['body'] = {
                in: 'body',
                description: 'Dados do novo livro',
                schema: {
                    $titulo: 'Clean Architecture',
                    $autor: 'Robert C. Martin',
                    $preco: 105.90,
                    paginas: 432
                }
            }
        */
        const resultado = LivroService.cadastrarLivro(req.body);
        if(!resultado.sucesso) {
            return res.status(400).json(resultado);
        }
        res.status(201).json(resultado);
    }

    atualizar(req, res) {
        /*  #swagger.parameters['body'] = {
                in: 'body',
                description: 'Dados para atualizar o livro (envie apenas os que deseja alterar)',
                schema: {
                    titulo: 'Clean Architecture Atualizado',
                    autor: 'Robert C. Martin',
                    preco: 110.00,
                    paginas: 432
                }
            }
        */
        const resultado = LivroService.atualizarLivro(req.params.id, req.body);
        if(!resultado.sucesso) {
            return res.status(404).json(resultado);
        }
        res.json(resultado);
    }

    deletar(req, res) {
        const resultado = LivroService.deletarLivro(req.params.id);
        if(!resultado.sucesso) {
            return res.status(404).json(resultado);
        }
        res.status(204).send();
    }
}

module.exports = new LivroController();
