


def jogar_forca():
    print("Bem-vindo ao jogo da forca!")

    palavra_secreta = "python"
    letras_acertadas = ["_", "_", "_", "_", "_", "_"]
    tentativas = 6

    while True:
        print("Palavra:", " ".join(letras_acertadas))
        print("Tentativas restantes:", tentativas)

        letra = input("Digite uma letra: ").lower()

        if letra in palavra_secreta:
            for i in range(len(palavra_secreta)):
                if palavra_secreta[i] == letra:
                    letras_acertadas[i] = letra
        else:
            tentativas -= 1

        if "_" not in letras_acertadas:
            print("Parabéns! Vocé ganhou!")
            break

        if tentativas == 0:
            print("Vocé perdeu! A palavra era:", palavra_secreta)
            break

jogar_forca()