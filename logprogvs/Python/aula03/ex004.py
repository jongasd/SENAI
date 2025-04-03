num = float(input("digite um número"))
cont = 0
while num != 0:
    if num > 100 and num < 200:
        cont = cont + 1
    num = float(input("digite um número"))
    continue
print("A contagem ficou em", cont)