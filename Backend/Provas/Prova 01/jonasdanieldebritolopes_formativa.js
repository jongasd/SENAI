// Exercício 01

// const statusCargas = {
// "BR12345": "Em trânsito para o centro de distribuição",
// "BR67890": "Entregue ao destinatário",
// "BR54321": "Aguardando retirada na agência"
// };
// function rastrearCarga(codigoRastreio, callback){
//     return callback(codigoRastreio)
// }
// function localizar(codigoRastreio){
//     if(statusCargas[codigoRastreio]){
//         return statusCargas[codigoRastreio]
//     } else {
//         return `Código de Rastreio Não Encontrado.`
//     }
// }
// console.log(rastrearCarga("BR12345", localizar))

// --------------------------------------------------------
// Exercício 02

// class ItemEstoque{
//     constructor(codigo, descricao, localizacao){
//         this.codigo = codigo
//         this.descricao = descricao
//         this.localizacao = localizacao
//     }

//     obterLocalizacao(){
//         return this.localizacao
//     }
//     atualizarLocalizacao(novaLocalizacao){
//         this.localizacao = novaLocalizacao
//         return this.localizacao
//     }
// }
// let sabonete = new ItemEstoque("sabonete Omo", "Sabonete cheiroso usado para máquinas de lavar", "SETOR S, 4 PRATELEIRA")
// console.log(sabonete.obterLocalizacao())
// console.log(sabonete.atualizarLocalizacao("SETOR B, PRATELEIRA 9"))
// console.log(sabonete.obterLocalizacao())

// --------------------------------------------------------
// Exercicio 03
// class RotaDeEntrega {
//     constructor(codigo, veiculo, destinos){
//     this.codigo = codigo
//     this.veiculo = veiculo
//     this.destinos = destinos
//     }
//     alterarRota(paradas){
//     return this.destinos = paradas
//     }
//     resumoRota(){
//         return `Resumo da Rota: Código: ${this.codigo}, Veículo Usado: ${this.veiculo} e Destino encaminhado: ${this.destinos}`
//     }
// }
// let entrega = new RotaDeEntrega("1234", "Mustang Shelby", "Ubatuba")
// console.log(entrega.destinos)
// entrega.alterarRota("Rio de Janeiro")
// console.log(entrega.resumoRota())

// --------------------------------------------------------
// Exercicio 04
// class Embalagem{
//     constructor(id, pesoMaximo){
//         this.id = id
//         this.pesoMaximo = pesoMaximo
//     }
// }
// class Caixa extends Embalagem {
//     constructor(largura, altura, profundidade, pesoMaximo){
//         super(pesoMaximo)
//         this.largura = largura
//         this.altura = altura
//         this.profundidade = profundidade
//     }
//     podeConter(pesoItem){
//         this.pesoMaximo = 25
//         if(pesoItem <= this.pesoMaximo){
//             return "Peso permitido"
//         } else {
//             return "Peso não permitido"
//         }
//     }
// }
// class Palete extends Embalagem {
//     constructor(material, pesoMaximo){
//         super(pesoMaximo)
//         this.material = material
//     }
//     podeConter(pesoItem){
//         this.pesoMaximo = 1000
//         if(pesoItem <= this.pesoMaximo){
//             return "Peso permitido"
//         } else {
//             return "Peso não permitido"
//         }
//     }
// }
// let caixa1 = new Caixa("10cm", "10cm", "10cm", 25)
// let palete1 = new Palete ("Madeira", 1000)
// console.log(caixa1.podeConter(10))
// console.log(palete1.podeConter(1000))

// --------------------------------------------------------

// Exercicio 05

// class Tarefa{
//     constructor(descricao, responsavel){
//         this.descricao = descricao
//         this.responsavel = responsavel
//     }
//     calcularTempoEstimado(){
//     }
// }

// class SepararPedido extends Tarefa {
//     calcularTempoEstimado(quantidadeItems){
//         return `A quantidade de tempo estimado será de ${quantidadeItems * 5} minutos.`
//     }
// }
// class ConferirCarga extends Tarefa{
//     calcularTempoEstimado(){
//         return`A quantidade de tempo estimado será de 60 minutos.`
//     }
// }

// let separar = new SepararPedido()
// let separar1 = new SepararPedido()
// let conferir = new ConferirCarga()
// let conferir1 = new ConferirCarga()

// let array = [separar.calcularTempoEstimado(5), separar1.calcularTempoEstimado(10), conferir.calcularTempoEstimado(), conferir1.calcularTempoEstimado()]
// for(i = 0; i < array.length; i++){
//     console.log(array[i])
// }

// --------------------------------------------------------

// Exercicio 06
// class Almoxarifado {
//     #quantidade
//     #nomeproduto
//     constructor(quantidade, nomedoproduto){
//         this.#quantidade = quantidade
//         this.#nomeproduto = nomedoproduto
//     }
//     adicionarProduto(qtd){
//         return this.#quantidade += qtd
//     }
//     retirarProduto(qtd){
//         if(this.#quantidade > qtd){
//             return this.#quantidade -= qtd
//         } else{
//             return "Erro, a tentativa de remoção é maior que a quantidade no sistema"
//         }
//     }
//     get consultarEstoque(){
//         return `O produto ${this.#nomeproduto} tem ${this.#quantidade} unidades no sistema`
//     }
// }

// let papel = new Almoxarifado(100, "papel")
// console.log(papel.adicionarProduto = 100)
// console.log(papel.retirarProduto = 200)
// console.log(papel.consultarEstoque)
