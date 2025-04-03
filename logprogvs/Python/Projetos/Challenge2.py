print("Exercício 07")
print("Ola usuário, me de um número e um operador para usar.")
num = float(input("Me de um número"))
op = input("Me de um operador")
num2 = float(input("Me de outro número"))
def soma(num, op, num2):
        return num + num2
def subtrai(num, op, num2):
        return num - num2
def multiplica(num, op, num2):
        return num * num2
def divide(num, op, num2):
        return num / num2
    
if op == "+":
    print(soma(num, op, num2))
if op == "-":
    troca2 = input("Deseja trocar os números? (S/N)")
    if troca2 == "S":
        num = num2
        num2 = num
    print(subtrai(num, op, num2))
if op == "*":
    print(multiplica(num, op, num2))
if op == "/":
    troca = input("Deseja trocar os números? (S/N)")
    if troca == "S":
        num = num2
        num2 = num
    print(divide(num, op, num2))
else:
    print ("Operador inválido")