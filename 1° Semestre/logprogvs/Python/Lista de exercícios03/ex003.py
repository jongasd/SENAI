print("Exercício 03")
print("Ola usuário, me de um valor, e eu vou gerar a tabuada dele do 1 ao 10.")
num = int(input("Me de um número"))
def tabuada(num):
    for i in range(1, 11):
        print(num, "x", i, "=", num * i)

tabuada(num)