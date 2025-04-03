v = [9,8,7,12,0,13,21]
P = []
I = []
for i in range(len(v)):
    if v[i] % 2 == 0:
        P.append(v[i])
    else:
        I.append(v[i])
print(P, "Pares")
print(I, "Impares")