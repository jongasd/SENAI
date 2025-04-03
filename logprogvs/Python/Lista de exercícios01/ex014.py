#-*- coding: UTF-8 -*-
print('Exercicio 14')
print('Um comerciante comprou um produto e quer vendê-lo com um lucro de 45% se o valor da compra for menor que R$ 20,00; caso contrário, o lucro será de 30%.')
produto = float(input("Me de o valor do produto"))
if produto < 20:
    lucro = produto * 45 / 100
    print("O valor do produto com o lucro de 45% é de", lucro)
else:
    lucro = produto * 30 / 100
    print("O valor do produto com o lucro de 30% é de", lucro)