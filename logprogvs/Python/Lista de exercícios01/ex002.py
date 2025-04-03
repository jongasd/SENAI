#-*- coding: UTF-8 -*-
import math
print('Exercicio 2')
print('Ola Usuário, me de um número, eu vou analisar se ele é positivo ou negativo.')
print('Se for positivo eu vou calcular a raiz quadrada, se for negativo eu vou calcular o quadrado.')
num = int(input("Me de um número"))
if num >= 0:
    raiz = math.sqrt(num)
    print("A raiz quadrada do número é", raiz)
elif num < 0:
    quadrado = num * num
    print("O quadrado do número é", quadrado)