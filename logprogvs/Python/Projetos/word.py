import autogui
import pyautogui
import time
import pyperclip

pyautogui.PAUSE = 1

pyautogui.press("winleft")  
pyautogui.write("notepad")
pyautogui.press("enter")

time.sleep(0.5)
pyautogui.write("Comi o cu de quem ta lendo!")



