#-*- coding: UTF-8 -*-
vel = int(input("Me de a velocidade do carro"))
kms = 80
if vel > kms :
    print("Você foi multado você vai pagar R$", (vel - 80) * 5)
else:
    print("Nenhuma multa")
