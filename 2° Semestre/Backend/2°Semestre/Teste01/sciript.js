// class Pessoa {
//     constructor(nome, idade) {
//         this.nome = nome;
//         this.idade = idade;
//     }
// }
// class Retangulo {
//   constructor(altura, largura) {
//     this.altura = altura;
//     this.largura = largura;
//   }
//   //Getter
//   get area() {
//     return this.calculaArea();
//   }

//   calculaArea() {
//     return this.altura * this.largura;
//   }
// }

// const quadrado = new Retangulo(10, 10);

// console.log(quadrado.area);
// class Pessoa {
//   constructor(nome, idade, profissao = "Desempregado") {
//     this.nome = nome;
//     this.idade = idade;
//     this.profissao = profissao;
//   }

//   apresentar() {
//     console.log(`Olá! Meu nome é ${this.nome}, tenho ${this.idade} anos e sou ${this.profissao}.`);
//   }

//   aniversario() {
//     this.idade++;
//     console.log(`Parabéns! ${this.nome} agora tem ${this.idade} anos.`);
//   }
// }

// // Criando objetos (instâncias)
// const p1 = new Pessoa("Ana", 25, "Engenheira");
// const p2 = new Pessoa("Carlos", 30);

// p1.apresentar();     // → Olá! Meu nome é Ana, tenho 25 anos e sou Engenheira.
// p2.apresentar();     // → Olá! Meu nome é Carlos, tenho 30 anos e sou Desempregado.
// p2.aniversario();    // → Parabéns! Carlos agora tem 31 anos.
