print("Me de 4 notas de 10 alunos, eu vou armazenar em uma lista e mostrar a quantidade de alunos com média maoir ou igual a 7,0.")
lista=[]
listanotas=[]
listaalunos=[]
for i in range (10):
    aluno = print("Aluno", i + 1)
    for j in range (4):
        num = float(input("Me de uma nota"))
        if num >= 7:
            listanotas.append(num)
    media = sum(listanotas) / len(listanotas)
    listaalunos.append(media)
    if num >= 7:
        lista.append(aluno)
media = sum(listanotas) / len(listanotas)
print("A media das notas foi", listaalunos)
print("Os alunos que ficaram acima de 7,0 foram", lista)