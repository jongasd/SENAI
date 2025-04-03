print("""Ola usuário, me de sua idade e vou lhe informar sua classe eleitoral, sendo:
Se for maior de 16 e menor de 18 ou maior de 65 anos, eleitor facultativo, abaixo de 16 anos, Não Eleitor, e acima de 18 anos e abaixo de 65, eleitor obrigatorio.""")
idade = int(input("Me de sua idade"))
def eleitor(idade):
    if idade < 16:
        print("Nao eleitor")
    elif idade >= 16 and idade < 18:
        print("Eleitor facultativo")
    elif idade >= 18 and idade < 65:
        print("Eleitor obrigatorio")
    else:
        print("Eleitor facultativo")
eleitor(idade)