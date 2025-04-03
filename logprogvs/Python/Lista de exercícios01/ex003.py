#-*- coding: UTF-8 -*-
print('Exercicio 3')
print('Ola Usuário, me dê dois números, eu vou analisar os dois e lhe dizer qual deles é maior')
num = int(input("Me de um número"))
num2 = int(input("Me de outro número"))
if num > num2:
    print("O primeiro número é maior")
elif num < num2:
    print("O segundo número é maior")
else:
    print("Os números são iguais, faça novamente.")