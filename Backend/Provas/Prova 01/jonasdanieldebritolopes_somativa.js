//Exercicio 01
// const estoque = {
// teclado: true,
// monitor: false,
// mouse: true,
// servidor: false
// };
// function verificarStatusItem(item, callback){
//     return callback(item)
// }
// function verItem(item){
//     if(estoque[item]){
//         return "Item disponível para despacho"
//     } else {
//         return "Item em falta no estoque"
//     }
// }
// console.log(verificarStatusItem("mouse", verItem))

// Exercício 02
// class Tarefa {
//     constructor(descricao, prioridade, duracaoEstimada){
//         this.descricao = descricao
//         this.prioridade = prioridade
//         this.duracaoEstimada = duracaoEstimada
//     }
//     alterarPrioridade(novaPrioridade){
//         return this.prioridade = novaPrioridade
//     }
//     detalharTarefa(){
//         return `${this.descricao}, Com a prioridade ${this.prioridade}, demora ${this.duracaoEstimada} horas.`
//     }
// }
// const lavarLouca = new Tarefa("Lavar Pratos e Talheres com uma esponja e detergente", "alta", 1)
// console.log(lavarLouca.alterarPrioridade("Mínima"))
// console.log(lavarLouca.detalharTarefa())

//Exercício 03
// class CustoProjeto{
//     constructor(nomeProjeto, orcamentoBase, diasPlanejados){
//         this.nomeProjeto = nomeProjeto
//         this.orcamentoBase = orcamentoBase
//         this.diasPlanejados = diasPlanejados
//     }
//     calcularCustoDiario(){
//         let custodiario = this.orcamentoBase / this.diasPlanejados
//         return custodiario
//     }
//     resumoCusto(){
//         let custodiario = this.orcamentoBase / this.diasPlanejados
//         return `O projeto ${this.nomeProjeto}, tem um orcamento base de: ${this.orcamentoBase}, para ${this.diasPlanejados} dias, com o custo diário de: ${custodiario}`

//     }
// }
// const projeto = new CustoProjeto("AMBALABU", 15000, 10)
// console.log(projeto.calcularCustoDiario())
// console.log(projeto.resumoCusto())

// Exercicio 04
// class Ativo {
//     constructor(nome, valorInicial, dataAquisicao){
//         this.nome = nome
//         this.valorInicial = valorInicial
//         this.dataAquisicao = dataAquisicao
//     }
//     calcularDepreciacao(){
//         return this.valorInicial
//     }
// }
// class Eletronico extends Ativo{
//     constructor(nome, valorInicial, dataAquisicao){
//         super(nome, valorInicial, dataAquisicao)
//     }
//     calcularDepreciacao(vidaUtilAnos){
//         if(this.valorInicial/vidaUtilAnos > 0){
//             return this.valorInicial/vidaUtilAnos
//         } else{
//             return "Valor Negativo"
//         }
//     }
//     fichaTecnica(){
//         return `O Ativo ${this.nome}, tem como valor Inicial: ${this.valorInicial} e foi Aquisitido em ${this.dataAquisicao}`
//     }
// }
// class Software extends Ativo{
//     calcularDepreciacao(licencaMensal){
//         return this.valorInicial/licencaMensal
//     }
//     fichaTecnica(){
//         return `O Ativo ${this.nome}, tem como valor Inicial: ${this.valorInicial} e foi Aquisitido em ${this.dataAquisicao}`
//     }
// }
// const eletronico1 = new Eletronico("Carro", "1000", "10/10")
// const software1 = new Software("Pou", "1000", "09/02" )
// console.log(eletronico1.fichaTecnica())
// console.log(software1.fichaTecnica())
// console.log(eletronico1.calcularDepreciacao(10))
// console.log(software1.calcularDepreciacao(5))

//Exercicio 05
// class Atividade {
//   constructor(nome, custoBase) {
//     this.nome = nome;
//     this.custoBase = custoBase;
//   }
//   calcularCustoTotal() {
//   }
// }
// class BaixoRisco extends Atividade {
//   calcularCustoTotal() {
//     this.custoBase -= this.custoBase * 10 / 100
//     return this.custoBase
//   }
// }
// class MedioRisco extends Atividade {
//   calcularCustoTotal() {
//     return this.custoBase;
//   }
// }
// class AltoRisco extends Atividade {
//     calcularCustoTotal(){
//         return this.custoBase + 500
//     }
// }


// const baixo1 = new BaixoRisco("Levantamento de Requisitos", 1000)
// const baixo2 = new BaixoRisco("Casos de Uso", 2000)
// const medio1 = new MedioRisco("Wireframe de Baixa Fidelidade", 10000)
// const medio2 = new MedioRisco("Wireframe de Média Fidelidade", 15000)
// const alto1 = new AltoRisco ("Wireframe de Alta Fidelidade", 30000)

// let array = [
//     baixo1.calcularCustoTotal(),
//     baixo2.calcularCustoTotal(),
//     medio1.calcularCustoTotal(),
//     medio2.calcularCustoTotal(),
//     alto1.calcularCustoTotal()]

// for(i = 0; i < array.length; i++){
//     console.log(array[i])
// }

//Exercicio 06
// class OrcamentoProjeto{
//     #verbaAlocada
//     nomeProjeto
//     constructor(verbaalocada, nomeProjeto){
//         this.#verbaAlocada = verbaalocada
//         this.nomeProjeto = nomeProjeto
//     }
//     registrarVerbaInicial(valor){
//         this.#verbaAlocada = valor
//         return valor
//     }
//     registrarDespesa(valor){
//         if(valor > this.#verbaAlocada){
//             return "Saldo insuficiente"
//         } else{
//             let valorDespesa = this.#verbaAlocada - valor
//             return valorDespesa
//         }
//     }
//     consultarSaldo(){
//         return `A verba alocada é de ${this.#verbaAlocada}`
//     }
// }
// const projeto1 = new OrcamentoProjeto(10000, "Ambabus")
// console.log(projeto1.registrarVerbaInicial(1000000))
// console.log(projeto1.registrarDespesa(100))
// console.log(projeto1.consultarSaldo())