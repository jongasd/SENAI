print("Exercício 05")
print("Olá usuário, me de um número e eu vou analisar se ele é primo ou não.")
num = int(input("Me de um número"))
def primo(num):
    for i in range(2, num):
        if num % i == 0:
            print("O número", num, "não é primo")
            break
        else:
            print("O número", num, "é primo")
            break

primo(num)