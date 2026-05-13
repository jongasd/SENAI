import autogui
import pyautogui
import time
import pyperclip

pyautogui.PAUSE = 1

pyautogui.press("winleft")
pyautogui.write("chrome")
pyautogui.press("enter")
pyautogui.write("https://google.com/")
pyautogui.press("enter")
pyautogui.write("Github")
pyautogui.press("enter")


time.sleep(2)
pyautogui.click(x=301, y=360)
pyautogui.write("Jonas")
time.sleep(0.5)
pyautogui.write("JongasD")

time.sleep(2)
pyautogui.press("enter")
pyautogui.click(x=100, y=500)

time.sleep(1)
pyautogui.click(x=600, y=300)
