print("Olá usuário, me de o lado (L) de um quadrado, e eu vou retornar a area do mesmo.")
lado = float(input("Me dê o lado"))
def area(lado):
    area = lado * lado
    return area
print("A area do quadrado eh", area(lado))