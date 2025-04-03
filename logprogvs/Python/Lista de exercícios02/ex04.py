print("Exercício 4")
print("Ola usuário, me de um número e vou lhe mostrar os divisores por ele")
num = int(input("Me de um número"))
for i in range(1, num + 1):
    if num % i == 0:
        print(i)