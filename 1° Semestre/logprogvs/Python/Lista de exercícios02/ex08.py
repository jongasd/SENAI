print("Exercício 8")
print("Ola usuário, me de diversas idades, eu vou lhe mostrar o total de pessoas com menos de 21 anos, total de pessoas com 50 anos, e se colocar a idade -99, o programa encerra e mostra o resultado")
num = int(input("digite uma idade"))
menor = 0
maior = 0
while num != -99:
    print (num)
    num = int(input("digite uma idade"))
    if num < 21:
        menor = menor + 1
    if num == 50:
        maior = maior + 1
    continue
print('O total de pessoas com menos de 21 anos foi', menor)
print('O total de pessoas com 50 anos foi', maior)