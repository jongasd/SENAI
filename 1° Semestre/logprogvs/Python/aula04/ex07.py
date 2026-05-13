print("Ola usuário, me de a quantia de imposto, e o custo do item antes do imposto e eu vou lhe retornar o custo do item apos o imposto.")
custo = float(input("Me dê o custo do item"))
imposto = float(input("Me dê o imposto"))
def somaimposto(custo, imposto):
    def taxalposto(custo, imposto):
        return (custo * imposto / 100)
    def custoimposto(custo, imposto):
        return (custo + taxalposto(custo, imposto))
    return custoimposto(custo, imposto)
print("O custo do item com o imposto é de", somaimposto(custo, imposto))