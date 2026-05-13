#-*- coding: UTF-8 -*-
print('Exercicio 1')
print("Olá Usuário, me de dois números, eu vou somá-los e vou analisar.")
print("Se a soma for maior que 20 eu vou somar 8, se for menor ou igual eu vou subtrair 5.")
num = float(input("Me de um número"))
num2 = float(input("Me de outro número"))
soma = num + num2
if soma > 20:
    res = soma + 8
    print("A soma dos números é", res)
elif soma <= 20:
    res = soma - 5
    print("A soma dos números é", res)
