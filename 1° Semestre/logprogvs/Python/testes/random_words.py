import tkinter as tk
import random

root = tk.Tk()
root.title("Gerador de Palavras Aleatórias")
root.geometry("1900x1080")
tamanho = 5
def aumentar_tamanho():
    global tamanho
    tamanho += 1
    return tamanho
def diminuir_tamanho():
    global tamanho
    tamanho -= 1
    return tamanho
def gerar_palavra():
    palavra = ""
    for i in range(tamanho):
        palavra += chr(random.randint(97, 122))
    return palavra

label = tk.Label(root, text="Palavra Gerada:")
label.pack()

button = tk.Button(root, text="Gerar Palavra", command=lambda: label.config(text=gerar_palavra()))
button.pack()
button = tk.Button(root, text="Almentar Tamanho", command=lambda: label.config(text=aumentar_tamanho()))
button.pack()
button = tk.Button(root, text="Diminuir Tamanho", command=lambda: label.config(text=diminuir_tamanho()))
button.pack()
button = tk.Button(root, text="Sair", command=root.quit)
button.pack()
root.mainloop()
