from pickletools import pyunicode
import pyautogui,sys

def moveMouse(distx, disty):
    x,y = pyautogui.position()
    pyautogui.moveTo(x + distx, y + disty)

moveMouse(sys.argv[1], sys.argv[2])