print("Exercício 02")
print("Ola usuário, me de um número inteiro, e eu vou calcular a multiplicação de todos os dígitos do mesmo.")
num = int(input("Me de um número"))
produto = 1
def multiplica_digitos(num):
    global produto
    while num > 0:
        for i in range(num -1, 1, -1):
            if num % i == 0:
                produto = produto * i
        if num == produto:
            print("O número", num, "é perfeito")
multiplica_digitos(num)
