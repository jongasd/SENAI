"""
Questão 9: (Dissertativa)

Verificação de Triângulo Escaleno

Descrição:

Escreva um programa que solicite o comprimento dos três lados de um triângulo e informe se ele é escaleno. (nenhum lado igual)

Entrada:

Três números inteiros representando os lados do triângulo.

Saída:


A mensagem "Escaleno" ou "Não é escaleno".

"""
print("Exercício 7")
print("Olá usuário, me de os lados de um triângulo e eu vou dizer se ele é escaleno.")
def triangulo_escaleno():
    lado1 = float(input("Me de o primeiro lado: "))
    lado2 = float(input("Me de o segundo lado: "))
    lado3 = float(input("Me de o terceiro lado: "))
    if lado1 != lado2 and lado2 != lado3 and lado1 !=lado3:
        print("Esse é um triângulo escaleno.")
    else:
        print("Esse não é um triângulo escaleno.")
triangulo_escaleno()
