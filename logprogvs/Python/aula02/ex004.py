#-*- coding: UTF-8 -*-
casa = float(input("me de o valor da casa"))
sal = float(input("me de o valor do seu salário"))
anos = int(input("me de a quantidade de anos"))
meses = anos * 12
prest = casa / meses
porc = sal * 30 / 100
if prest <= porc :
    print("Seu emprestimo foi aprovado")
else:
    print("Seu emprestimo foi negado")