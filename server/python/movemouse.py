from pickletools import pyunicode
import pyautogui,sys

def moveMouse(distx, disty):
    x,y = pyautogui.position()
    pyautogui.moveTo(x + int(distx), y + int(disty))


moveMouse(sys.argv[1], sys.argv[2])

print("Tried to move mouse!")
sys.stdout.flush()