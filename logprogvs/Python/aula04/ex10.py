print("Ola Usuário me de dois valores e eu vou lhe mostrar a soma dos números impáres entre eles(Inclusive A e B), considerando que A é a maior que B.")
A = int(input("Me de um número"))
B = int(input("Me de outro número"))
soma = 0
def impares(A, B, soma):
    if A < B:
        for i in range(A, B + 1):
            if i % 2 != 0:
                soma = soma + i
        print("A soma dos números impáres entre", A, "e", B, "é", soma)
    else:
        print("ERRO. O primeiro número tem que ser menor que o segundo.")
impares(A, B, soma)