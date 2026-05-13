print("Me de a idade e a altura de 5 pessoas, e eu vou mostrar na ordem inversa a que foi mostrada.")
altura = []
idade = []
for i in range(5):
    num = float(input("Me de a altura"))
    altura.append(num)
    num = int(input("Me de a idade"))
    idade.append(num)
altura.reverse
idade.reverse
print(altura)
print(idade)