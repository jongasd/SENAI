print("Me de 10 caracteres MINÚSCULOS e eu vou mostrar quantas constoantes foram lidas.")
lista = []
vogal = ["a", "e", "i", "o", "u"]
vogal1 = 0
consoante = 0
for i in range(10):
    num = input("Me de um caracter")
    lista.append(num)
    if num in vogal:
        vogal1 = vogal1 + 1
    else:
        consoante = consoante + 1
print("A quantidade de consoantes foi", consoante)

