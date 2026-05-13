num = float(input("digite um número"))
cont = 0 
valor = 0
while num >= -1:
    cont = cont + 1
    media = cont
    valor = valor + num
    num = float(input("digite um número"))
    continue
if num == 0:
    media = cont + 1
res = valor / media
print(res)