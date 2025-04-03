import tkinter as tk
import random
import time

class CampoMinado:
    def __init__(self):
        self.janela = tk.Tk()
        self.janela.title("Campo Minado")
        self.janela.state("zoomed")  # ajusta a janela para usar a tela inteira

        self.frame = tk.Frame(self.janela)
        self.frame.place(relx=0.5, rely=0.5, anchor="center")

        self.grid_size_x = 20  # tamanho da grid em x
        self.grid_size_y = 20  # tamanho da grid em y
        self.grid = [[0 for _ in range(self.grid_size_x)] for _ in range(self.grid_size_y)]

        self.botões = []
        for i in range(self.grid_size_y):
            linha = []
            for j in range(self.grid_size_x):
                botão = tk.Button(self.frame, width=5, height=2)
                botão.grid(row=i, column=j)
                botão.bind("<Button-1>", lambda event, i=i, j=j: self.clique(i, j))
                botão.bind("<Button-3>", lambda event, i=i, j=j: self.colocar_bandeira(i, j))
                linha.append(botão)
            self.botões.append(linha)

        self.gerar_bombas()

    def gerar_bombas(self):
        bombas = []
        for _ in range(50):  # número de bombas
            x = random.randint(0, self.grid_size_x - 1)
            y = random.randint(0, self.grid_size_y - 1)
            bombas.append((x, y))
        self.grid = [[0 for _ in range(self.grid_size_x)] for _ in range(self.grid_size_y)]
        for x, y in bombas:
            self.grid[y][x] = "*"
        for i in range(self.grid_size_y):
            for j in range(self.grid_size_x):
                if self.grid[i][j] != "*":
                    contagem = 0
                    for x in range(-1, 2):
                        for y in range(-1, 2):
                            if 0 <= i + y < self.grid_size_y and 0 <= j + x < self.grid_size_x:
                                if self.grid[i + y][j + x] == "*":
                                    contagem += 1
                    self.botões[i][j].config(text="")

    def clique(self, i, j):
        if self.botões[i][j].cget("text") == "F":
            return
        if self.grid[i][j] == "*":
            self.botões[i][j].config(text="*", bg="red")
            print("Game Over!")
            time.sleep(3)
            exit()
        else:
            self.abrir_célula(i, j)

    def abrir_célula(self, i, j):
        if self.botões[i][j].cget("text") != "":
            return
        contagem = 0
        for x in range(-1, 2):
            for y in range(-1, 2):
                if 0 <= i + y < self.grid_size_y and 0 <= j + x < self.grid_size_x:
                    if self.grid[i + y][j + x] == "*":
                        contagem += 1
        if contagem > 0:
            self.botões[i][j].config(text=str(contagem))
        else:
            self.botões[i][j].config(text="")
            for x in range(-1, 2):
                for y in range(-1, 2):
                    if 0 <= i + y < self.grid_size_y and 0 <= j + x < self.grid_size_x:
                        self.abrir_célula(i + y, j + x)

    def colocar_bandeira(self, i, j):
        if self.botões[i][j].cget("text") == "":
            self.botões[i][j].config(text="F", bg="yellow")
        elif self.botões[i][j].cget("text") == "F":
            self.botões[i][j].config(text="", bg="SystemButtonFace")

    def run(self):
        self.janela.mainloop()

if __name__ == "__main__":
    campo_minado = CampoMinado()
    campo_minado.run()