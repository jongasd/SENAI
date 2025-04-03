print("Olá usuário, me de dois números e eu vou retornar (True) se o primeiro é múltiplo do segundo, ou (False) se não for.")
anum = float(input("Me dê um número"))
bnum = float(input("Me dê outro número"))
def multiplo(anum, bnum):
    if anum % bnum == 0:
        print("True")
    else:
        print("False")

multiplo(anum, bnum)