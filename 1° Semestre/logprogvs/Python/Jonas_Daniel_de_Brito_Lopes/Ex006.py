"""
Questão 6: (Dissertativa)

Descrição:

Escreva um programa que solicite um número e exiba todos os números ímpares de 1 até esse número.

Entrada: Um número inteiro. 

Saída: A sequência de números ímpares até o número fornecido.
"""

print("Exercício 6")
print("Ola usuário, me de um número inteiro e eu vou exibir todos os números ímpares de 1 até esse número.")

num = int(input("Me de um número: "))

for i in range(1, num, 2):
          print(i)
          
          
