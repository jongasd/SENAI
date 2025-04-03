v1 = int(input("digite a primeira nota"))
v2 = int(input("digite a segunda nota"))
v3 = int(input("digite a terceira nota"))
r2 = v1 + v2 + v3 /3
if r2 >= 7 :
    print("Passou de Ano")
else:
    if r2 < 5 and r2 >= 0:
        print("Recuperação")
    else:
        print("Não passou de Ano")
