print("Exercício 9")
print("Ola usuário, me de números inteiros positivos, e vou te mostrar a soma dos números pares e a soma dos números ímpares, e o programa vai encerrar quando for inserido um número maior que 100.")
num = int(input("digite um número"))
par = 0
impar = 0
while num <= 100:
    print (num)
    if num % 2 == 0:
        par = par + num
    else:
        impar = impar + num
    num = int(input("digite um número"))
    continue
print('A soma dos números pares foi', par)
print('A soma dos números ímpares foi', impar)