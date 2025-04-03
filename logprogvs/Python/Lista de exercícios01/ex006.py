#-*- coding: UTF-8 -*-
print('Exercicio 6')
print('Ola Usuário, me de dois numeros inteiros e eu vou analisar se o primeiro é divisivel pelo segundo.')
num = int(input("Me de um número"))
num2 = int(input("Me de outro número"))
if num % num2 == 0:
    print('O primeiro número é divisível pelo segundo número')
else:
    print('O primeiro número nao é divisível pelo segundo número')