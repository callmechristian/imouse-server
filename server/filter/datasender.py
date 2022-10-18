#!/usr/bin/env python
# coding: utf-8

# In[15]:


from websocket import create_connection
import json
import numpy
import websocket
import threading


# In[16]:


server=create_connection("ws://localhost:7071/")
with open(r"C:\Users\12144\Desktop\data1.json",'r',encoding='utf8') as fp:
  data=json.load(fp)
  print(data[1])
def senddata(datai):
    server.send(json.dumps([datai]))
for i in range(len(data)):
    threading.Timer(0.01,senddata,[data[i]]).start()
    


# In[ ]:





# In[ ]:




