#-*- coding: UTF-8 -*-
kwh = int(input("Quantos quilowatts foram consumidos"))
tp = input("Qual o Tipo de Instalação?, R para residencias, I para indústrias e C para comercios")
if tp == "R" and "r":
    if kwh <= 500:
        print("O valor a pagar é de", kwh * 0.40)
    else:
        print("O valor a pagar é de", kwh * 0.65)
elif tp == "I" and "i":
    if kwh <= 10000:
        print("O valor a pagar é de", kwh * 0.55)
    else:
        print("O valor a pagar é de", kwh * 0.60)
elif tp == "C" and "c":
    if kwh <= 2500:
        print("O valor a pagar é de", kwh * 0.55)
    else:
        print("O valor a pagar é de", kwh * 0.60)
else:
    print("Erro")
