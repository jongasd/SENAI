import math

print("Ola usuário, me de um raio e vou lhe retornar a area do circulo.")
raio = float(input("Me dê o raio"))
def area(raio):
    pi = math.pi
    area = pi * raio ** 2
    return area
print("A area do circulo eh", area(raio))