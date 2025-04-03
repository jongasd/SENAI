#-*- coding: UTF-8 -*-
print('Exercicio 15')
print('Me de a Temperatura atual, e eu vou lhe dar o Resultado.')
temp = float(input("Me de a temperatura"))
if temp <= 15:
    print('Muito Frio')
elif temp >= 16 and temp <= 23:
    print('Frio')
elif temp >= 24 and temp <= 26:
    print('Agradável')
elif temp >= 26 and temp <= 30:
    print('Quente')
elif temp >= 31:
    print('Muito Quente')
