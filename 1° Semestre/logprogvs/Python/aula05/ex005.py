print("Me de elementos de 2 listas, e eu vou criar uma terceira lista com eles.")
lista1 = []
lista2 = []

for i in range(10):
    num1 = int(input("Me de um número para a lista 1 "))
    num2 = int(input("Me de outro número para a lista 2 "))
    lista1.append(num1)
    lista2.append(num2)

lista3 = lista1 + lista2
print(lista3)