"""
Questão 8: (Dissertativa)

Contagem de Palavras em uma Frase

Descrição:

Escreva um programa que solicite ao usuário um número inteiro e conte quantos números positivos ele possui até esse número, usando um loop while.

Entrada: Um número inteiro. 

Saída: A quantidade de números positivos até o número informado.
"""
print("Exercício 8")
print("Ola usuário, me de um número inteiro e eu vou contar quantos números positivos você possui até esse número.")

cont = 0
while True:
    num = int(input("Me de um número inteiro: "))
    if num >= 0:
              cont += 1
              print(cont, "números positivos.")
