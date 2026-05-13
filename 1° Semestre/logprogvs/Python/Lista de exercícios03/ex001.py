print("Exercício 01")
print("Me de a altura e o raio de um cilindro e eu vou lhe retornar o volume do mesmo.")
altura = float(input("Me de a altura"))
raio = float(input("Me de o raio"))
def volume_cilindro(altura, raio):
    volume = 3.14 * (raio**2) * altura
    return volume
print("O valor do raio é de. %.2f", volume_cilindro(altura, raio))