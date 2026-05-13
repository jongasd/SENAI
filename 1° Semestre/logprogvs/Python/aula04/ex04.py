print("Ola usuário, me dê a base e a altura de um triângulo e retorne a sua area.")
base = float(input("Me dê a base"))
altura = float(input("Me dê a altura"))
def area(base, altura):
    area = (base * altura) / 2
    return area
print ("A area do triângulo eh", area(base, altura))
