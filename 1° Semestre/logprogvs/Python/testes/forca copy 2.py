def jogar_forca():
    print("Bem-vindo ao jogo da forca!")

    palavrasecreta = "Python"
    dica = "Marlon Gregg Adora"
    letras_acertadas = ["_"] * len(palavrasecreta)  # Criando uma lista de underscores
    tentativas = 6

    while True:
        print("Palavra:", " ".join(letras_acertadas))  # Exibe a palavra com underscores
        print("Tentativas restantes:", tentativas)
        chute = input("Você quer chutar a palavra diretamente? (sim/nao): ").lower()

        if chute == "sim":
            chute = input("Digite a palavra: ").lower()
            if chute == palavrasecreta:
                print("Parabéns! Vocé ganhou!")
                break
            else:
                tentativas -= 1
                

        # tentar acertar a palavra direto
        if "".join(letras_acertadas) == "python":
            print("Parabéns! Vocé ganhou!")
            break

        letra = input("Digite uma letra: ").lower()  # Lê a letra inserida

        if letra in palavrasecreta:
            # Atualiza as posições corretas na lista de letras acertadas
            for i in range(len(palavrasecreta)):
                if palavrasecreta[i] == letra:
                    letras_acertadas[i] = letra  # Substitui o underscore pela letra correta
        else:
            tentativas -= 1  # Se errou, diminui uma tentativa

        if "_" not in letras_acertadas:  # Verifica se o usuário acertou todas as letras
            print("Parabéns! Você ganhou!")
            break
        
        if tentativas == 4:  # Exibe a dica
            print(f"Dica: {dica}")

        if tentativas == 0:  # Verifica se o usuário perdeu
            print(f"Você perdeu! A palavra era: {palavrasecreta}")
            break

    print("Fim do jogo.")

jogar_forca()
