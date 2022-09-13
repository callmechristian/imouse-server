from pickletools import pyunicode
import pyautogui,sys

import sys
 
def moveMouse(distx, disty):
    x,y = pyautogui.position()
    pyautogui.moveTo(x + int(distx), y + int(disty))


for line in sys.stdin:
    array = line.split(" ")
    if 'q' == line.rstrip():
        break
    print(f'Input : {line}')
    moveMouse(array[0], array[1])

print("exit")
