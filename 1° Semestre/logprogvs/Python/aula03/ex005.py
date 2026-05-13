sexo =(input("Digite seu sexo: m para masculino e f para feminino, caso queira para digite x"))
cont = 0
cont1 = 0
while sexo != "x":
    if sexo == "m" or sexo == "M":
        cont = cont + 1
    elif sexo == "f" or sexo == "F":
        cont1 = cont1 + 1
    sexo =(input("Digite seu sexo: m para masculino e f para feminino"))
    continue
print(f"A contagem ficou de pessoas Masculinas foi {cont} e Femininas foi {cont1}")