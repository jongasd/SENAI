print("Ola usuário, me de um número e vou lhe mostrar o Fatorial de um número")
num = int(input("Me de um número"))
fatorial = 1
for i in range(1, num + 1):
    fatorial = fatorial * i
print("O fatorial de", num, "é", fatorial)
