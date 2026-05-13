print("Exercício 04")
print("Ola usuário, me de um número e eu vou fazer a contagem regressiva dele, para o ano novo.")
num = int(input("Me de um número"))
def contagem_regressiva(num):
    for i in range(num, -1, -1):
        print(i)
contagem_regressiva(num)
print("Feliz Ano Novo!!!!")