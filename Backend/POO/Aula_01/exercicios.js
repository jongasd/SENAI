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
// const batata = new Produto("batata", 10.99, 10)
// console.log(batata.valorEstoque())
//############################################################################################
// Exercício 02
// class Filme {
//     constructor(titulo, ano, diretor) {
//         this.titulo = titulo;
//         this.ano = ano;
//         this.diretor = diretor;
//     }
//     filmeInfo() {
//         return "O filme" + this.titulo + "foi lançado em " + this.ano + "e dirigido por" + this.diretor
//     }
// }
// const matrix = new Filme("Matrix", 1999, "Wachowski")
// matrix.filmeInfo()
//############################################################################################
// Exercício 03
// class Aluno{
//     constructor(nome, nota1, nota2) {
//         this.nome = nome;
//         this.nota1 = nota1;
//         this.nota2 = nota2;
//     }
//     calcularMedia(){
//         let media = (this.nota1 + this.nota2) / 2
//         return media
//     }
//     aprovacao(){
//         let media = this.calcularMedia()
//          if(media <= 7){
//               return "Reprovado"
//          } else {
//              return "Aprovado"
//           }
//       }
//     }
// const aluno1 = new Aluno("Jonas", 10, 5)
// console.log(aluno1.aprovacao())
//############################################################################################
// Exercício 04
// class Retangulo {
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
// const retangulo1 = new Retangulo(10, 90)
// console.log(retangulo1.area())
//############################################################################################
// Exercício 05



