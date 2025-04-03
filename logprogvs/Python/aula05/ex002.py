print("Me dê 10 números reais e eu vou motrá-los na tela na ordem inversa")
lista = []
for i in range(10):
    num = float(input("Me de um número"))
    lista.append(num)
lista.sort(reverse=True)
print(lista)