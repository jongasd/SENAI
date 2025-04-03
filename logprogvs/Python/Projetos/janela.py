import pygame
import sys

# Inicialize o Pygame
pygame.init()

# Defina as dimensões da janela
largura = 1500
altura = 800

# Crie a janela
janela = pygame.display.set_mode((largura, altura))

# Defina a cor branca
branco = (255, 255, 255)

# Preencha a janela com a cor branca
janela.fill(branco)

# Atualize a janela
pygame.display.update()

# Loop principal
while True:
    for evento in pygame.event.get():
        if evento.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

# Escrever na janela
    fonte = pygame.font.Font(None, 36)
    texto = fonte.render("Olá, mundo!", True, (0, 0, 0))
    janela.blit(texto, (largura // 2 - texto.get_width() // 2, altura // 2 - texto.get_height() // 2))

    # Atualize a janela
    pygame.display.update()

