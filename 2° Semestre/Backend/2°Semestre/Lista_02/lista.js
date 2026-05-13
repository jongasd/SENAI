// exercicio 01
// let cont = 0
// function contar (palavra){
//     let vogal = ["a","e", "i", "o", "u", "A", "E", "I", "O", "U"]
//     for( i = 0; i < palavra.length; i++){
//         for (j = 0; j < vogal.length; j++){
//         if (palavra[i] == vogal[j]){
//             cont += 1
//         }
//         }
//     }
// }
// contar("Abacaxi")
// console.log(cont)

// exercicio 02
// function fibonacci(num){
//     let sequencia = [0,1]
//     for (i = 2; i < num; i++){
//         let soma = sequencia[i - 1] + sequencia[i- 2]
//         if (i > num){
//             break
//         }
//         sequencia.push(soma)
//     }
// }
// console.log(fibonacci(10))

// exercicio 03
// function primos(lista){
//     let lprimos = []
//     for(i = 0; i < lista.length; i++){
//         let div = []
//         for(j = 1; j <= lista[i]; j++){
//             if(lista[i] % j == 0){
//                 div.push(j)
//             }
//         }
//         if (div.length == 2){
//             lprimos.push(lista[i])
//         }
//     }
// return console.log(lprimos)
// }
// primos([14,165,90,5,3,5,6,7])

//exercicio 04
function palindromo(palavra) {
    let aocontrario = []
    let palavracerta = palavra.split("")
        for(j = palavracerta.length - 1; j >= 0; j--){
        aocontrario.push(palavracerta[j])
        console.log(aocontrario)
        if (palavracerta[j] != aocontrario[j]){
            
        }
    }
}
console.log(palindromo("cabelo"))