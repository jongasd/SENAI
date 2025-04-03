#-*- coding: UTF-8 -*-6
print('Exercicio 12')
print('Me de dois números inteiros, e eu vou garantir que fiquem em ordem crescente.')
num = int(input("Me de um número"))
num2 = int(input("Me de outro número"))
if num > num2:
    B = num
    A = num2
    print('O número', A, 'é menor')
    print("O número", B, "é maior")
    
elif num < num2:
    A = num
    B = num2
    print('O número', A, 'é menor')
    print("O número", B, "é maior")
    