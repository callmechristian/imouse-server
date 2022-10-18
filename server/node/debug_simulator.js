var data = require('./process_data');
const { setRelativeMousePosition } = require('./mouse');
const {getCursorPosition, setCursorPosition, sendCursorEvent, cursorEvents} = require("node-cursor");

const WebSocket = require('ws');
const { calculateDisplacement } = require('./process_data');
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

      const att = JSON.parse(messageAsString);

      if(opt_debug) console.log(att);
      if(att != undefined) {
        var position = calculateDisplacement(att.roll, att.pitch, att.yaw);
        console.log(position);
        dist_x = Math.abs(position.d_x);
        dist_y = Math.abs(position.d_y);
        if(opt_debug) console.log(dist_x + " + " + dist_y);
      }
      
      setCursorPosition({
        x: dist_x,
        y: dist_y
      });
    });  
});

//on websocket exit
wss.on("close", () => {

});

console.log("Web socket online...\n");