dia = int(input("me de um valor de dias"))
horas = int(input("me de um valor em horas"))
minutos = int(input("me de um valor em minutos"))
segundos = int(input("me de um valor em segundos"))
conversao = dia * 86400
conversao2 = horas * 3600
conversao3 = minutos * 60
resultado =  conversao3 + segundos + conversao + conversao2
print("O valor é", resultado, "segundos.") 