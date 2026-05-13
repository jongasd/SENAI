// class Pessoa{
//     constructor(nome, idade){
//         this.nome = nome;
//         this.idade = idade;
//     }
//     apresentar(){
//         console.log(this.nome, this.idade)
//     }
// }
// let pessoa1 = new Pessoa ("Sofia", 40)
// pessoa1.apresentar()

// class Produto{
//     constructor(nome, preco){
//         this.nome = nome
//         this.preco = preco
//     }
//     mostrarPreco(){
//         console.log( this.nome, this.preco);
//     }
// }
// let produto1 = new Produto("SAL", 10)
// produto1.mostrarPreco()

// class Funcionario{
//     constructor(nome){
//         this.nome = nome
//     }
// }
// class Gerente extends Funcionario {
//     constructor(nome, setor){
//         super(nome)
//         this.setor = setor
//     }
//     mostrarNomeeSetor(){
//         console.log(this.nome, this.setor)
//     }
// }
// let gerente1 = new Gerente("Roberto", 10)
// gerente1.mostrarNomeeSetor()

// class Veiculo{
//     constructor(marca){
//         this.marca = marca
//     }
// }
// class Carro extends Veiculo{
//     constructor(marca, modelo){
//         super(marca)
//         this.modelo = modelo
//     }
//     mostrarMarcaeModelo(){
//         console.log(this.marca, this.modelo)
//     }
// }
// let carro1 = new Carro("Chevrolet", "Camoro SS")
// carro1.mostrarMarcaeModelo()

// class Conta {
//   #saldo;
//   constructor(saldo) {
//     this.#saldo = saldo;
//   }
//   depositar(valor) {
//     this.#saldo = this.#saldo + valor;
//     return this.#saldo;
//   }
//   mostrarSaldo() {
//     return this.#saldo;
//   }
// }
// let conta1 = new Conta(1000);
// console.log(conta1.depositar(1000));
// console.log(conta1.mostrarSaldo());

// class Aluno {
//     #nota
//     constructor(){
//         this.#nota = 0
//     }
//     definirNota(nota){
//         return this.#nota = nota
//     }
//     mostrarNota(){
//         return this.#nota
//     }
// }
// let aluno1 = new Aluno()
// console.log(aluno1.definirNota(10))
// console.log(aluno1.mostrarNota())