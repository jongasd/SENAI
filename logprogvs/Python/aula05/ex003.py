print("Me de 4 notas, e eu vou mostrar a media das notas e as notas novamente.")
lista = []

for i in range (4):
    num = float(input("Me de uma nota"))
    lista.append(num)
    print(num)
media = (lista[0] + lista[1] + lista[2] + lista[3]) / len(lista)
print("A media das notas foi", media)