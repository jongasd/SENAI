#-*- coding: UTF-8 -*-
print('Exercicio 16')
print('Me de sua idade, e vou classificar sua faixa etária')
idade = int(input("Me de sua idade"))  
if idade <= 2:
    print("Bebe")
elif idade > 2 and idade <= 12:
    print("Crianca")
elif idade > 12 and idade <= 23:
    print("Adolescente")
elif idade > 23 and idade <= 70:
    print("Adulto")
else:
    print("Idoso")