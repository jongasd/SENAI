
import pygame
import sys

# Inicialize o Pygame
pygame.init()

# Defina as dimensões da janela
largura = 800
altura = 600

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
