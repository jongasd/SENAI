// ex001
// class InstrumentoMusical{
//     tocar(){
//         console.log("Tocando")
//     }
// }
// class Violao extends InstrumentoMusical {
//     tocar(){
//         console.log("Tocando violao")
//     }
// }
// class Piano extends InstrumentoMusical {
//     tocar(){
//         console.log("Tocando Piano")
//     }
// }
// let piano1 = new Piano()
// piano1.tocar()
//
//ex002
// class Funcionario {
//     constructor(nome,salario){
//         this.nome = nome
//         this.salario = salario
//     }
// }
// class Gerente extends Funcionario {
//     constructor(nome,salario, bonus){
//         super(nome, salario)
//         this.bonus = bonus
//     }
// }
// let gerente1 = new Gerente("Geraldo", 15000, 300)
// gerente1.bonus
//
//ex003
// class Veiculo{
//     constructor(marca, ano){
//         this.marca = marca
//         this.ano = ano
//     }
// }
// class Carro extends Veiculo {
//     constructor(portas){
//         this.portas = portas
//     }
// }
// class Moto extends Veiculo{
//     constructor(cilindradas){
//         this.cilindradas = cilindradas
//     }
// }
// let carro1 = new Carro("Peugeot 206", 2009)
// let moto1 = new Moto("Hayabusa", 2009)
//
//ex004
// class Funcionario {
//     constructor(nome, salario){
//         this.nome = nome
//         this.salario = salario
//     }
//     calcularSalario(){
//         return salario + 0
//     }
// }
// class Gerente extends Funcionario {
//     calcularSalario(){      
//     return console.log(this.salario + (this.salario * 30 / 100))
//     }
// }
// class Desenvolvedor extends Funcionario {
//     calcularSalario(){
//         return console.log(this.salario + (this.salario * 20 / 100))
//     }
// }
// let gerente1 = new Gerente("Geraldo", 15000)
// let dev1 = new Desenvolvedor("Roberto", 150000)
// gerente1.calcularSalario()
// dev1.calcularSalario()

// ex005
// class ContaBancaria{
//     constructor(titular, saldo){
//         this.titular = titular
//         this.saldo = saldo
//     }
//     depositar(valor){
//         this.valor = valor
//         saldo += valor
//         return saldo
//     }
//     sacar(valor){
//         this.valor = valor
//         saldo -= valor
//         return saldo
//     }
// }
// class ContaCorrente extends ContaBancaria {
//     sacar(valor){
//         this.valor = valor
//         this.saldo -= (valor + 2)
//         return this.saldo
//     }
// }
// class ContaPoupança extends ContaBancaria{
//     atualizarSaldo(valor){
//         this.valor = valor
//         return this.saldo += (valor * 5 / 100)
//     }
// }
// let contacorrente = new ContaCorrente("Ipsun", 1500)
// let contapoupança = new ContaPoupança("Ipsun", 1500)
// console.log(contacorrente.sacar(1000))
// console.log(contapoupança.atualizarSaldo(1000))

//ex006
// class Produto {
//     #nome
//     #preco
//     constructor(nome, preco){
//         this.#nome = nome
//         this.#preco = preco
//     }
//     get getPreco(){
//         return this.#nome
//     }
//     get getNome(){
//         return this.#nome
//     }
//     set setPreco(value){
    
//         if(value >= 0){
//             return this.preco = value
//         } else {
//             console.log("Valor Inválido")
//         }
//     }
//     set setNome(value){
//         this.value = value
//         return nome = value
//     }
// }
// let preco = new Produto(1000)
// let nome = new Produto("Jonas")
// console.log(preco.setPreco = 1)
// console.log(nome.setNome = "Labubu")
//
//ex007
// class Carro {
//     #velocidade
//     constructor(velocidade){
//         this.#velocidade = velocidade
//     }
//     acelerar(){
//        return velocidade += 10
//     }
//     frear(){
//         if(this.velocidade > 0){
//         return velocidade -= 10
//         } else{
//             console.log("ERRO")
//         }
//     }
// }
// let car = new Carro(100)
// console.log(car.frear())