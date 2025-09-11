// Exercício 01
// class produto {
//     constructor(nome, preco, quantidade) {
//         this.nome = nome;
//         this.preco = preco;
//         this.quantidade = quantidade;
//     } 
//     valorEstoque() {
//         return this.preco * this.quantidade;
//     }
// }
// const batata = new produto("batata", 10.99, 10)
// console.log(batata.valorEstoque())
//############################################################################################
// Exercício 02
// class filme {
//     constructor(titulo, ano, diretor) {
//         this.titulo = titulo;
//         this.ano = ano;
//         this.diretor = diretor;
//     }
//     filmeInfo() {
//         return "O filme" + this.titulo + "foi lançado em " + this.ano + "e dirigido por" + this.diretor
//     }
// }
// const matrix = new filme("Matrix", 1999, "Wachowski")
// matrix.filmeInfo()
//############################################################################################
// Exercício 03
// class aluno{
//     constructor(nome, nota1, nota2) {
//         this.nome = nome;
//         this.nota1 = nota1;
//         this.nota2 = nota2;
//     }
//     calcularMedia(){
//         let media = (nota1 + nota2) / 2
//         return media
//     }
//     aprovacao(media){
//          if(media <= 7){
//               return "Reprovado"
//          } else {
//              return "Aprovado"
//           }
//       }
//     }
// const aluno1 = new aluno("Jonas", 10, 9)
// console.log(aluno1.aprovacao())
//############################################################################################
// Exercício 04
// class retangulo {
//     constructor(base, altura) {
//         this.base = base;
//         this.altura = altura;
//     }
//     area(){
//         let res = this.base * this.altura
//         return res
//     }
//     perimetro(){
//         let res = (this.base * 2) + (this.altura * 2)
//         return res
//     }
// }
// const retangulo1 = new retangulo(10, 90)
// console.log(retangulo1.area())
//############################################################################################
// Exercício 05
// class carro {
//     constructor(marca, modelo, combustivel){
//         this.marca = marca;
//         this.modelo = modelo;
//         this.combustivel = combustivel;
//     }
//     abastecer(litro){
//         this.combustivel = this.combustivel + litro;
//         return this.combustivel 
//     }
//     dirigir(km){
//         let res = {}
//         if (km /10 > this.combustivel) {
//         res = "Precisa Abastecer";
//         return res
//     }
//         this.combustivel -= km/10
//          res = "Km rodados:" + km;
//         return res;
//     }
// }
// const c1 = new carro("Bugatti", "Chiron", 10 )
// console.log(c1.dirigir(101))
