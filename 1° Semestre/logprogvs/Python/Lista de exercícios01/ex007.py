#-*- coding: UTF-8 -*-
print('Exercicio 7')
print('Ola Usuário, me de o número de horas trabalhadas, a cada hora, a empresa vai pagar 19,50, e recolhe-se para o imposto de renda o valor de 10%, apenas se for acima de 1500')
num = int(input("Me de o número de horas trabalhadas"))
if num > 1500:
    salario = num * 19.50
    imposto = salario * 0.10
    salariofinal = salario - imposto
    print("O salario a receber é de", salariofinal)
else:
    salario = num * 19.50
    print("O salario a receber é de", salario)