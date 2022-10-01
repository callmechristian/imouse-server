var data = require('./process_data');

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 7071 });

//options
const opt_debug = true;

//vars
var dist_x = 0;
var dist_y = 0;
var psi_hat = 0;

//on websocket connect
wss.on('connection', (ws) => {
    console.log('Device connected\n');

    ws.on('message', (messageAsString) => {
      time = Date.now();
      dt = time - prevTime;
      prevTime = time;

      const message = JSON.parse(messageAsString);
      if(message != undefined) {
        var att = data.estimateAttitude(message.x,message.y,message.z, message.m_x,message.m_y,message.m_z, message.g_x, message.g_y, message.g_z, psi_hat, dt/60);
        psi_hat = att.psi_hat;
      }
      
      setCursorPosition(getCursorPosition() + {
        x: dist_x,
        y: dist_y
      });
    });  
});

//on websocket exit
wss.on("close", () => {

});

console.log("Web socket online...\n");