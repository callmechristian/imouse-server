
var data = require('./process_data');
const { getCursorPosition, setCursorPosition, sendCursorEvent, cursorEvents } = require("node-cursor");
const { sendMouseLeftClick, sendMouseRightClick, setMousePosition } = require('./mouse');


// websocket
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8000 });

// options
const opt_debug = true;

// global vars
var dt;
var time;
var prevTime = 0;
var dist_x = 0;
var dist_y = 0;
var psi_hat_g_old = 0;
var theta_hat_g_old = 0;
var phi_hat_g_old = 0;

// on websocket connect
wss.on('connection', (ws) => {
    console.log('Device connected.\n');

    ws.on('message', (messageAsString) => {

      // to calculate dataFrequency
      time = Date.now();
      dt = time - prevTime;
      prevTime = time;

      // get JSON contents
      const message = JSON.parse(messageAsString);

      // check if message was well defined
      if(message != undefined) {
        var attitude = data.estimateAttitudeComplementary(message.a_x, message.a_y, message.a_z, message.m_x, message.m_y, message.m_z, message.g_x, message.g_y, message.g_z, theta_hat_g_old, phi_hat_g_old, psi_hat_g_old, dt)
        // var att = data.estimateAttitude(message.a_x,message.a_y,message.a_z, message.m_x,message.m_y,message.m_z, message.g_x, message.g_y, message.g_z, psi_hat, dt/60);
        // psi_hat = att.psi_hat;
        // console.log(message);
        console.log(attitude);
      } else {
        console.error("Message is undefined!\n");
      }

      // if message contains attitude data
      if(message.roll != undefined && message.yaw != undefined && message.pitch != undefined) {
        var disp = data.calculateDisplacement(message.roll, message.pitch, message.yaw);
        
        setMousePosition(disp.x, disp.y);
        // if(opt_debug) console.log(message);
      } else {
        // else if message contains event data
        console.log(message)
        if(!message.click_up && message.click_down) {
          sendMouseLeftClick();
        } 
        if(message.click_up && !message.click_down) {
          sendMouseRightClick();
        }
        if(message.alt_tab) {
          // send alt tab
        }
        if(message.ctrl_l) {
          //send ctrl l
        }
        if(message.scroll) {
          var scroll_x = message.scroll_x;
          var scroll_y = message.scroll_y;

          //get active scrollable window info
        }
        if(message.volume_up) {
          // windows increase volume
        }
        if(message.volume_down) {
          // windows decrease volume
        }
      }
    });  
});

// on websocket exit
wss.on("close", () => {
  console.log("\nWebsocket closed.\n")
});

console.log("Web socket online.\n");