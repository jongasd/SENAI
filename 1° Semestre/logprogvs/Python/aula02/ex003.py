#-*- coding: UTF-8 -*-
num1 = float(input("me de um valor"))
num2 = float(input("me de outro valor"))
operacao = input("me de uma operação")
if operacao == "+" :
    print(num1 + num2)
elif operacao == "-" :  
    print(num1 - num2)
elif operacao == "*" or "x" or "X" :
    print(num1 * num2)
elif operacao == "/" or "." :
    print(num1 / num2)