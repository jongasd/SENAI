import random
print("Bem vindo ao Gerador de Senhas aleatórias, me de a quantidade de senhas que deseja gerar, e com quantos caractéres é desejado em sua senha.")
qtd = int(input("Me de a quantidade de senhas que deseja gerar: "))
caracteres = int(input("Me de a quantidade de caracteres que deseja na senha: "))
alfabeto = ["a", "A", "b", "B", "c", "C", "d", "D", "e", "E","f", "F", "g", "G", "h", "H", "i", "I", "j", "J", "k", "K", "l", "L", "m", "M", "n", "N", "o", "O", "p", "P", "q", "Q", "r", "R", "s", "S", "t", "T", "u", "U", "v", "V", "w", "W", "x", "X", "y", "Y", "z", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "+", "=", "?", ">", "<", "/", ".", ",", ";", ":"]

for i in range(qtd):
    senha = ""
    for j in range(caracteres):
        senha = senha + random.choice(alfabeto)

    print("Senha", i + 1, senha)
    print(" ")
print("Essas Senhas geradas, são senhas fortes, porque contem letras maiúsculas, minúsculas, numeros e simbolos, são mais difíceis de serem descobertas, mas sempre guarde-as e não conte a ninguém.")
print("Obrigado por usar o Gerador de Senhas")
