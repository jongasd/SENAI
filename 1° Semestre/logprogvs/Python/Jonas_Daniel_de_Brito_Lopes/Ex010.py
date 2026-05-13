"""
Questão 10: (Dissertativa)

Descrição:

Escreva um programa que solicite o valor inicial, a taxa de juros e o número de períodos, e calcule o valor final com juros compostos de forma simples. O cálculo pode ser feito com a fórmula:

VF=VI×(1+i)n

Onde:

VF é o valor final. VI é o valor inicial. i é a taxa de juros por período (em forma decimal). n é o número de períodos. 



Entrada: Três números reais representando o valor inicial, a taxa de juros e o número de períodos.

Saída: O valor final com juros compostos.
"""
print("Exercício 10")
print("Ola usuário, me de o valor inicial, a taxa de juros e o número de períodos e eu vou calcular o valor final com juros compostos.")

vi = float(input("Me de o valor inicial: "))
i = float(input("Me de o valor da taxa de juros por período em decimal: "))
n = float(input("Me de o número de períodos: "))

vf = vi *(i-1) * n
print(f"O valor final ficou em: {vf}")
