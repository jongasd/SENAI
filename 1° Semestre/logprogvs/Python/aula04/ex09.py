print("""Olá usuário, me de uma nota de um aluno, e eu vou dar o coneceito dele, sendo:
      notas inferiores a 3, conceito E
      notas de 3 a 5, conceito D
      notas de 6 a 7, conceito C
      notas de 8 a 9, conceito B
      notas de 10, conceito A
      """)
notas = float(input("Me dê a nota"))
def conceito(nota):
    if nota < 3:
        return "E"
    elif nota < 6:
        return "D"
    elif nota < 8:
        return "C"
    elif nota < 10:
        return "B"
    else:
        return "A"
print(conceito(notas))