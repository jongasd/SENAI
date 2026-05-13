#-*- coding: UTF-8 -*-
print('Exercicio 8')
print('Ola Usuário, A prefeitura de Contagem abriu uma linha de crédito para os funcionários estatutários. O valor máximo da prestação não poderá ultrapassar 30% do salário bruto. ')
sal = float(input("Me de o valor do seu salário"))
prest = float(input("Me de o valor da prestação"))
if prest <= sal * 30 / 100:
    print("Seu emprestimo foi aprovado")
else:
    print("Seu emprestimo foi negado")