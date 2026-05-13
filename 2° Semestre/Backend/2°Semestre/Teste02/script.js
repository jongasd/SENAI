

function processarEntidade(entidade) {
  if (typeof entidade.executar === 'function') {
    entidade.executar();
  } else {
    console.log('Erro: entidade deve ter um método "executar".');
  }
}
// Passando uma instância de uma classe anônima como argumento
processarEntidade(
  new class {
    constructor(mensagem = 'Olá do objeto anônimo!') {
      this.mensagem = mensagem;
    }

    executar() {
      console.log(this.mensagem);
    }
  }()
);
// Saída: Olá do objeto anônimo!