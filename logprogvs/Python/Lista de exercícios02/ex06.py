print("Exercício 6")
print("Ola usuário, me de diversos números e eu vou calcular as médias, quando for inserido um número negativo, o programa vai encerrar.")

num = float(input("digite um número"))
cont = 0 
valor = 0
while num >= -1:
    print (num)
    cont = cont + 1
    media = cont
    valor = valor + num
    num = float(input("digite um número"))
    if num == 0:
        media = cont + 1
        break
res = valor / media
print("A média dos números inseridos foi", res)