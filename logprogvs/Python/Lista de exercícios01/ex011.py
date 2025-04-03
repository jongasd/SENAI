#-*- coding: UTF-8 -*-
print('Exercicio 11')
print('Numa faculdade, os alunos com média maior ou igual a 7,0 são aprovados, aqueles com média inferior a 3,0 são reprovados e os demais ficam de recuperação.')
nota1 = float(input("Me de a primeira nota"))
nota2 = float(input("Me de a segunda nota"))
media = (nota1 + nota2) / 2
if media >= 7:
    print("Aprovado")
elif media < 3:
    print("Reprovado")
else:
    print("Recuperação")