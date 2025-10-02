// Var, Let e Const

var nome = "João";
nome = "Maria";
console.log(nome); // Maria
// Var permite redeclaração e reatribuição

let idade = 25;
idade = 26;
console.log(idade); // 26
// Let permite reatribuição, mas não redeclaração (dentro do mesmo escopo, diferente de var)
// let idade = 30; // Isso causaria um erro

const pi = 3.14;
console.log(pi); // 3.14
// const cria uma variável que não pode ser alterada, como pi que sempre será 3.14
// pi = 999999; // Isso causaria um erro

//------------------------------------------------------------

// Laços de Repetição (For e While)

// For
for (let i = 0; i < 5; i++) {
  console.log("Número:", i);
}
// como funciona esse for: Ele vai começar o valor inicial no 0 (let i = 0), ele irá repetir até que o número seja menor que 5 (i < 5) ou seja até 5 ele vai executar, e ele irá acrescentar de 1 em 1, por isso usamos o i++, para representar i + 1 (i++), ou seja se a contagem fosse regressiva seria i-1 (i--). Com isso enquanto ele estiver repetindo os números da contagem estarão sendo mostrados.

//While
i = 0;
while (i < 5) {
  console.log("Número", i);
  i++;
}
// como funciona esse while: Ele irá executar o mesmo esquema do For realizado acima, a diferença é que nesse caso o código fica maior e menos orgnaizado, porém tem a mesmas propriedades.

//------------------------------------------------------------

//Listas
let lista = ["Jonas", "Mateus", "Valle", "Anthero"]; // Criando a lista igual no python
lista.push("Pietro"); // O .push adiciona o nome Pietro na lista
lista.pop("Pietro"); // O .pop remove o nome Pietro da lista
console.log(lista.length); // O .length conta quantos nomes tem na lista, nesse caso teria 4.

//------------------------------------------------------------

//Funções

//Função Normal
function somar(a, b) {
  let resultado = a + b;
  return resultado;
}
console.log(somar(1 + 1));
// como funciona essa função: A função somar pega os valores "a" e "b" e somam e dps trazem o resultado. Se vc nn traz o return nessa função, o resultado dela nn vai ser nada. E depois chamamos a função dentro do console pra mostrar o resultado da soma com os valores de a = 1 e b = 1.

//Função Declarada
console.log(soma(10 + 10)); // executa a função primeiro
function soma(a, b) {
  // depois declara oq ela é
  let resultado = a + b;
  return resultado;
}
// como funciona essa função: A função Declarada executa a função antes que ela seja declarada, igual mostrado acima. O código é igual da função somar acima.

//Função Anônimma
soma = function (a, b) {
  let resultado = a + b;
  return resultado;
};
console.log(soma(1 + 1));
// como funciona essa função: A função anônima é igual a uma função normal porém a palavra "soma" e "function" trocam de lugar.

// Arrow Function
let soma = (a, b) => {
  return a + b;
}; // ele cria a variável soma e dentro dela cria uma arrow function que vai retornar o valor de a + b
console.log(soma(1 + 1));
//como funciona essa função: A arrow function ja é um pouco mais complexa, ela é uma função curta, que é criada dentro de uma variável, ela é usada para coisas pequenas tipo soma.

// Função de Callback
function executarCallback(callback) {
  // aqui ele cria a função executarCallback recebendo uma função de callback, ou seja uma função que recebe uma função.
  callback(); // aqui ele chama a funcao de callback e executa ela
}
executarCallback(function () {
  console.log("Executando callback");
});
//como funciona essa função: A função de callback recebe uma função como parâmetro, e ela executa essa função quando a função de callback é chamada.
//lembrar: callback significa chamar devolta, então sempre que vc chamar uma função de callback, ela vai executar a funcao que foi criada dentro dela.

//-----------------------------------------------------------

//Classes

class soma {
  constructor(a, b) {
    // o constructor cria as variáveis a e b a partir dos valores de a e b que são passados como parâmetro. Sempre que uma classe for instanciada, o constructor vai ser executado. Lembre: toda vez que for criar uma classe, tem que ter um constructor.
    this.a = a;
    this.b = b;
  }
  somar() {
    // aqui temos o método somar, que toda vez que for chamada vai retornar o valor de a + b
    return this.a + this.b;
  }
}
let soma1 = new soma(1, 1); // aqui criamos um objeto chamado soma1, pois para chamar uma classe, é preciso de um objeto para que ela funcione, e nesse caso o soma1 é o objeto e traz como atributo a e b.
console.log(soma1.somar()); // e para mostrar a soma, tem que usar o objeto com o método que você quer executar, que no caso é soma.
//como funciona essa class: A classe tem dentro dela um constructor que cria as variáveis a e b, e dentro dela tem um metodo chamado somar, que vai retornar o valor de a + b.

//------------------------------------------------------------

// 4 pilares da Orientação a Objetos
// Abstração
// Encapsulamento
// Herança
// Polimorfismo

// Abstração
// A abstração ela é um pilar mais lógico do que físico, ele consiste na ideia de ocultar valores na hora da programação, o que isso quer dizer: se a pessoa quer saber quanto ficou a média dela em uma matéria ele vai perguntar o valor das notas e vai devolver a média, a pessoa não precisa saber como que esse cálculo foi executado, o que ela precisa é que o código esteja funcionando e trazendo o resultado que ela espera.

// Encapsulamento

class contaBanco {
  #saldoconta; //define como privado
  #senhaconta; //define como privado
  constructor(saldoconta, senhaconta) {
    this.#saldoconta = saldoconta; // chama os parametros para dentro da class
    this.#senhaconta = senhaconta;
  }
  sacar(senha) {
    // cria um método que recebe o parametro senha
    if (senha == this.#senhaconta) {
      // verifica se a senha contida no metodo e igual a senha contida na class
      this.#saldoconta -= 100; // altera o valor de saldo dentro do método, isso só é possível pois não estamos retirando de forma direta, apenas dentro do metodo. o -= (#saldoconta = #saldoconta - 100) significa que ele vai retirar 100 do valor contido na class.
      console.log("Saque realizado com sucesso");
    }
  }
}
let conta1 = new contaBanco(1000, 1234);
console.log(conta1.sacar(1234));
// Como funciona o Encapsulamento: Nessa primeira parte o atributo fica privado, ou seja não é possível que ele seja chamado ou alterado, apenas se for dentro de um método, como exemplo o método sacar.

// Para ver os valores:

class contaBanco {
  #saldoconta; // atributo privado
  constructor(saldoconta) {
    this.#saldoconta = saldoconta; // chama para dentro da class
  }
  get getsaldo() {
    // método usado para mostrar o valor dentro do atributo privado. Lembrar: Sempre que quiser ver um valor de um atributo privado tem que usar um get antes do nome do método, se não ele vai dar erro.
    return this.#saldoconta;
  }
}
let conta2 = new contaBanco(1000);
console.log(conta1.getsaldo);
// Como funciona o Encapsulamento: Nessa segunda parte ele consegue mostrar o valor contido dentro de um atributo privado, o get serve para mostrar o valor contido dentro do atributo privado, ou seja ele mostra o valor dentro de #saldoconta a partir do get.

// Para alterar o valor:

class contaBanco {
  #saldoconta; // atributo privado
  constructor(saldoconta) {
    this.#saldoconta = saldoconta; // chama para dentro da class
  }
  set setsaldo(saldoconta) {
    // set serve para alterar o valor contido dentro do atributo privado, ou seja ele altera o valor dentro de #saldoconta a partir do set. Altera o valor contido dentro do atributo privado
    this.#saldoconta = saldoconta;
  }
}
let conta3 = new contaBanco(1000);
console.log((conta3.setsaldo = 500));
// Como funciona o Encapsulamento: Nessa terceira parte ele consegue alterar o valor contido dentro de um atributo privado, o set serve para alterar o valor dentro do atributo privado, ou seja ele altera o valor dentro de #saldoconta a partir do set com o valor dado.

// Herança
class materia {
  // criando classe genérica
  constructor(nome, nota) {
    this.nome = nome; // chama para dentro da class
    this.nota = nota;
  }
  status() {
    // cria um método genérico
    console.log("O aluno " + this.nome + " tirou a nota " + this.nota);
  }
}
class matematica extends materia {
  // cria uma class que herda da class genérica
  status() {
    // altera o atributo para de acordo com a class.
    console.log(
      "O aluno " + this.nome + " tirou a nota " + this.nota + " em matematica"
    );
  }
}
let aluno1 = new matematica("Joaquim", 10); // o objeto criado sempre será na classe definida como foi herdeira.
aluno1.status();
// Como funciona a Herança: A herança é simples, ela herda caracteristícas de uma classe e passa para outra, ou seja a classe matematica herda as caracteristicas da classe materia e passa para ela. Lembre: Para a herança funcionar tem que existir uma classe genérica com metodos genéricos, como por exemplo classe matéria (classe genérica) e matemática (classe que herda), se não ele vai dar erro.

// herança com super
class materia {
  // criando classe genérica
  constructor(nome, nota) {
    this.nome = nome; // chama para dentro da class
    this.nota = nota;
  }
  status() {
    // cria um método genérico
    console.log("O aluno " + this.nome + " tirou a nota " + this.nota);
  }
}
class matematica extends materia {
  // cria uma class que herda da class genérica
  constructor(nome, nota) {
    super(nome, nota); // chama o construtor da class genérica pois será usado no método status.
  }
  status() {
    console.log("O aluno " + this.nome + " tirou a nota " + this.nota + " em  matematica"); // altera o atributo para de acordo com a class.
  }
}
let aluno2 = new matematica("Joaquim", 10); // o objeto criado sempre será na classe definida como foi herdeira.
aluno1.status();
// Como funciona a Herança: O super é usado para chamar um método ou atributo da class genérica, ou seja ele chama o construtor da class genérica. Como no método status usa o nome e a nota, ele chama o nome e a nota da class genérica com o super.

// Polimorfismo
// O polimorfismo consiste em sobrecarga de métodos, ou seja ele pode ter o mesmo nome, mas com comportamentos diferentes.

// Sobrecarga de métodos
// O polimorfismo consiste em sobrecarga de métodos, ou seja ele pode ter o mesmo nome, mas com comportamentos diferentes.
class soma {
  somar(a,b){ // será executado caso seja passado apenas 2 números
    return a + b
  }
  somar (a,b,c){ // será executado caso seja passado 3 números
    return a + b + c
  }
}
let soma2 = new soma()
console.log(soma1.somar(1,2))
console.log(soma1.somar(1,2,3))
// Como funciona o Polimorfismo: O polimorfismo consiste em sobrecarga de métodos, ou seja ele pode ter o mesmo nome, mas com comportamentos diferentes, como nesse caso que temos 2 situações, quando é passado apenas 2 números, ele vai executar o primeiro método, e quando houver 3 números ele executará o segundo método .