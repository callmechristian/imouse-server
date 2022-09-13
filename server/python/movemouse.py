from pickletools import pyunicode
import pyautogui,sys

def moveMouse(distx, disty):
    pyautogui.move(int(distx), int(disty))


moveMouse(sys.argv[1], sys.argv[2])

print("Tried to move mouse!")
sys.stdout.flush()