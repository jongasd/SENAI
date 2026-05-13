print("Exercício 07")
print("Ola usuário, me de um número e um operador para usar.")
num = int(input("Me de um número"))
op = input("Me de um operador")
num2 = int(input("Me de outro número"))
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
    print(subtrai(num, op, num2))
if op == "*":
    print(multiplica(num, op, num2))
if op == "/":
    print(divide(num, op, num2))
else:
    print ("Operador inválido")