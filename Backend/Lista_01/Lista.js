
// Exercicio 1
// let num1 = 1
// let num2 = 2
// function somar (num1, num2) {
//     let res = num1 + num2
//     return res
// }
// console.log(somar(num1, num2))


// #####################################################################

// Exercicio 2
// let num1 = 10
// let num2 = 8
// let num3 = 3
// function media (num1, num2, num3) {
//     let res = (num1 + num2 + num3) / 3
//     return res
// }
// console.log(media(num1, num2, num3))


// #####################################################################

// Exercicio 3
// const somar = function(base, altura) {
//     let res = base * altura
//     return res
// }
// result = somar(10, 20)
// console.log(result)


// #####################################################################

// Exercicio 4
// conta = function(num) {
//     let res = num
//     if(num % 2 == 0){
//         res = "Par"
//     }else{
//         res = "Impar"
//     }
//     return console.log(res)
// }
// console.log(conta(10))


// #####################################################################

// Exercicio 5
// let maior = (num1, num2) => {
//     let res = num1
//     if(num1 > num2){
//         res = num1
//     }else{
//         res = num2
//     }
//     return res
// }
// console.log(maior(10, 8))


// #####################################################################

// Exercicio 6
// let array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
// let pares = (array) => {
//     for(let i = 0; i < array.length; i++){
//         if (array[i] % 2 == 0){
//             console.log(array[i])
//         }
//     }
// }
// pares(array)


// #####################################################################

// Exercicio 7
// (function(){
//     return console.log(".")
// })()


// #####################################################################

// Exercicio 8
// (function(){
//     let quadrado = (num) => {
//         let res = num * num
//         return res
//     }
//     console.log(quadrado(10))
// })()


// #####################################################################

// Exercicio 9
// let nome = "Fernando"
// function executarCallback(callback, nome){
//     callback(nome)
//     console.log("Boas Vindas", nome)
// }
// executarCallback2(function(){
//     console.log("Boas Vindes", nome)
// })


// #####################################################################

// Exercicio 10
// let array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
// function executarCallback(array, callback){
//     callback(array)
// }
// function dobrar(callback){
//     for(let i = 0; i < array.length; i++){
//         array[i] *= 2
//     }
//     return console.log(array)
// }
// executarCallback(array, dobrar)

// #####################################################################

// Exercicio 11
// function contagemRegressiva(n) {
//     if (n > 0) {
//         console.log(n)
//         contagemRegressiva(n - 1)
//     }
// }
// contagemRegressiva(10)


// #####################################################################

// Exercicio 12
// async function executar(){
//     setTimeout(() => {console.log(".")}, 2000)
// }
// executar()


// #####################################################################

// Exercicio 13
// let num1 = 10
// async function executar(){
//     setTimeout(() => {console.log(num1* 2)}, 1000)

// }
// executar()
// console.log(num1)


// #####################################################################

// Exercicio 14
async function carregado(){
    setTimeout(() => {console.log("Carregado, Conectado na Rede")}, 3000)
}
carregado()
console.log("Carregando")