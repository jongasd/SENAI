#-*- coding: UTF-8 -*-
print('Exercicio 13')
print('Ola Usuário, me de três notas, e sua média, depois eu vou analisar sua situação.')
nota1 = float(input("Me de a primeira nota"))
nota2 = float(input("Me de a segunda nota"))
nota3 = float(input("Me de a terceira nota"))
falta = int(input("Me de a quantidade de faltas"))
media = (nota1 + nota2 + nota3) / 3
if media >= 7:
    print("Aprovado")
elif media < 3 or falta > 20:
    print("Reprovado")
else:
    print("Recuperação")