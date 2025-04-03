print("Exercício 7")
print("Olá usuário, me de diversos números e eu vou mostrar para você, qual deles é o maior, e qual deles é o menor, caso seja inserido um número negativo, o programa encerra e mostra o resultado")

num = float(input("digite um número"))
maior = num
menor = num
while num >= 0:
    print (num)
    num = float(input("digite um número"))
    if num > maior:
        maior = num
    if num < menor:
        menor = num
    continue
print('O maior número foi', maior)
print('O menor número foi', menor)