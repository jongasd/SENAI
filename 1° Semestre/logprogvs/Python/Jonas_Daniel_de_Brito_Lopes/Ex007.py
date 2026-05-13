"""
Função para de Triângulo Equilátero

Descrição:

Crie uma função triangulo_equilatero que receba os lado de um triângulo e diga se ele é equilátero (3 lados iguais)

Entrada:

os 3 lados

Saída:


Dizer se é equilátero

"""
print("Exercício 7")
print("Olá usuário, me de os lados de um triângulo e eu vou dizer se ele é equilátero.")
def triangulo_equilatero():
    lado1 = float(input("Me de o primeiro lado: "))
    lado2 = float(input("Me de o segundo lado: "))
    lado3 = float(input("Me de o terceiro lado: "))
    if lado1 == lado2 and lado2 == lado3:
        print("Esse é um triângulo equilátero.")
    else:
        print("Esse não é um triângulo equilátero.")
triangulo_equilatero()
