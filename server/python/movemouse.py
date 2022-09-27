from ast import Interactive
from pickletools import pyunicode
import pyautogui,sys

import sys
import math

pyautogui.FAILSAFE = False

def moveMouse(distx, disty):

    # pyautogui.move(int(distx), int(disty))

    pyautogui.moveTo(int(distx), int(disty))
old_yaw=0
old_pitch=0
# with open("../../logs/pitch_up.log") as f:
#     lines = f.readlines()
#     for line in lines:
#         array = line.split(" ")
#         yaw = int(array[0])
#         pitch = int(array[1])
#         if abs(yaw-old_yaw) > 2 or abs(pitch-old_pitch) > 10:
#             old_yaw = yaw
#             old_pitch = pitch
#             moveMouse(yaw, pitch)
for line in sys.stdin:
    array = line.split(" ")
    if 'q' == line.rstrip():
        break

    yaw = int(array[0])
    pitch = int(array[1])
    if abs(yaw-old_yaw) > 2 or abs(pitch-old_pitch) > 50:
        old_yaw = yaw
        old_pitch = pitch
        moveMouse(yaw, pitch)
    sys.stdout.write("Sorry, I didn't understand that.\n")
    sys.stdout.flush()
    print(f'Input : {line}')

    moveMouse(array[0], array[1])

print("exit")
