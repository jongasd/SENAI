"""
Cálculo de Desconto por Faixa de Valor

Descrição:

Escreva um programa que solicite o valor de uma compra e aplique um desconto de 5% se o valor for entre R$50 e R$100, ou 10% se for maior que R$100.

Entrada:

Um número real representando o valor da compra.

Saída:


O valor total da compra com o desconto aplicado, se necessário.
"""
print('Exercício 02')
print("Olá usuário, me de um valor de compra e eu vou aplicar um desconto de acordo com o valor: Se o valor for entre R$50 e R$100 5%, se for maior que R$100 10%.")

num = float(input("Me de um valor de compra: "))

def desc(num):
    if num > 50 and num < 101:
    #desconto 5%
        valor = num - num * 5 / 100
        
        print(f"O valor do desconto é de 5%, e o valor de compra com o desconto é: {valor}")
    elif num > 100:
    #desconto 10%
        valor1 = num * 10 / 100 - num
        print(f"O valor do desconto é de 10%, e o valor de compra com o desconto é: {valor1}")
        
    else:
        print("O seu valor não é compatível com nenhum dos valores disponíveis para desconto, logo não haverá desconto.")
desc(num)
