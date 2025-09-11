// Exercício 01
// class Produto {
//     constructor(nome, preco, quantidade) {
//         this.nome = nome;
//         this.preco = preco;
//         this.quantidade = quantidade;
//     } 
//     valorEstoque() {
//         return this.preco * this.quantidade;
//     }
// }
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
//      aprovacao(media){
//          if(media >= 7){
//               return "Aprovado"
//          } else {
//              return "Reprovado"
//           }
//       }
//     }
//############################################################################################
// Exercício 04
// class retangulo {
//     constructor(base, altura) {
//         this.base = base;
//         this.altura = altura;
//     }
//     area(){
//         let res = base * altura
//         return res
//     }
//     perimetro(){
//         let res = (base * 2) + (altura * 2)
//         return res
//     }
// }
//############################################################################################
// Exercício 05
// class carro {
//     constructor(marca, modelo, combustivel){
//         this.marca = marca;
//         this.modelo = modelo;
//         this.combustivel = combustivel;
//     }
//     abastecer(litro){
//         this.litro = litro;
//         combustivel = combustivel + litro;
//         return combustivel 
//     }
//     dirigir(km){
//         this.km = km;
//         km = 10 * litro;
//         let res = "Km rodados:" + km;
//             if (km < litro) {
//             res = "Precisa Abastecer";
//     }
//     return res;
//     }
// }
// const c1 = new carro("Bugatti", "Chiron", 10 )
