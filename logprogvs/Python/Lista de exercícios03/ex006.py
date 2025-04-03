print("Exercício 06")
print("Olá usuário, me de a temperatura em Celsius e eu vou retornar a temperatura em Fahrenheit, ou Vice-versa.")
temp = float(input("Me de a temperatura "))
tptemp = input("Me de a temperatura em Celsius ou Fahrenheit, C ou F ")
def contc(temp, tptemp):
    if tptemp == "C":
        contc = (temp - 32) * 5 / 9
        print("A temperatura em Celsius é de", contc)
    elif tptemp == "F":
        contf = 9 / 5 * temp + 32
        print("A temperatura em Fahrenheit é de", contf)
contc(temp, tptemp)