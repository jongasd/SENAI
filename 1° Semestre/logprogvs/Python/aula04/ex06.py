print("Me de um argumento, eu vou lhe retornar (P), caso seu valor for positivo, ou (N), caso seja zero ou negativo.")

num = float(input("Me dê um número"))
def posneg(num):
    if num > 0:
        print("P")
    else:
        print("N")
posneg(num)