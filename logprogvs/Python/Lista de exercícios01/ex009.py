#-*- coding: UTF-8 -*-
print('Exercicio 9')
print('Ola Usuário, me de o valor da sua altura e também do seu peso, eu vou calcular seu IMC(Indice de massa corporal)')
print('E eu vou lhe mostrar a sua situação atual')
altura = float(input("Me de a sua altura"))
peso = float(input("Me de o seu peso"))
imc = peso / (altura ** 2)
if imc < 19 and imc > 0:
    print("Sua situação atual é Abaixo do peso")
elif imc >= 20 and imc <= 24.9:
    print("Sua situação atual é peso normal")
elif imc >= 25 and imc <= 29.9:
    print("Sua situação atual é sobrepeso")
elif imc >= 30 and imc <= 40:
    print("Sua situação atual é obeso")
elif imc >= 40:
    print("Sua situação atual é obesidade mórbida")