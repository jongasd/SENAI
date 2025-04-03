print("Olá usuário me de dois números e eu vou lhe retornar somente o maior deles.")
anum = float(input("Me dê um número"))
bnum = float(input("Me dê outro número"))
def contar(anum, bnum):
    if anum == bnum:
        print("Erro, os dois números são iguais.")
    elif anum < bnum:
        print("O segundo é maior", bnum)
    else:
        print("O primeiro é maior", anum)

contar(anum, bnum)
