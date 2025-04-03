"""
Questão 4: (Dissertativa)

Verificação de Número Primo

Descrição:

Escreva um programa que solicite um número e informe se ele é primo.

Entrada:

Um número inteiro.

Saída:

A mensagem "Primo" ou "Não é primo".

"""
print("Exercício 4")
print("Olá usuário, me de um número e eu vou lhe mostrar se ele é primo ou não é primo.)

num = float(input("Me de um número: "))
if num % 2 == 0:
    #primo
      print(f"O número {num} é primo.")
else
    #não é primo
    print(f"O número {num} não é primo.")
