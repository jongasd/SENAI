#-*- coding: UTF-8 -*-
print('Exercicio 10')
print('Me dê três números reais, e eu vou analisar se eles podem ou não formar um triângulo.')
print('Se eles podem formar um triângulo eu vou dizer qual o tipo de triângulo.')
num = float(input("Me de um número"))
num2 = float(input("Me de outro número"))
num3 = float(input("Me de outro número"))
if num < num2 + num3 and num2 < num + num3 and num3 < num + num2:
    print("Os números podem formar um triângulo")
    if num == num2 == num3:
        print("O triângulo formado é equilátero")
    elif num == num2 or num == num3 or num2 == num3:
        print("O triângulo formado é isóceles")
    else:
        print("O triângulo formado é escaleno")
else:
    print("Os números nao podem formar um triângulo")