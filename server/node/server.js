
var data = require('./process_data');
const { getCursorPosition, setCursorPosition, sendCursorEvent, cursorEvents } = require("node-cursor");
const { sendMouseLeftClick, sendMouseRightClick, setMousePosition } = require('./mouse');


// websocket
const WebSocket = require('ws');
const { pi, asin } = require('mathjs');
const { calculateDisplacement } = require('./process_data');
const e = require('express');
const wss = new WebSocket.Server({ port: 8000 });

// options
const opt_debug = true;

// global vars
var dt;
var time;
var prevTime = 0;
var dist_x = 0;
var dist_y = 0;

// filter
var KalmanFilter = require('kalmanjs')

var kf_y = new KalmanFilter();
var kf_x = new KalmanFilter();

// on websocket connect
wss.on('connection', (ws) => {
    console.log('Device connected.\n');

    // instantiate some important vars
    var psi_hat = 0;
    var last_x = 0;
    var last_y = 0;
    var psi_hat_g_old = 0;
    var theta_hat_g_old = 0;
    var phi_hat_g_old = 0;

    ws.on('message', (messageAsString) => {

      // to calculate dataFrequency
      time = Date.now();
      dt = time - prevTime;
      prevTime = time;

      var attitude;

      // get JSON contents
      const message = JSON.parse(messageAsString);

      // check if message was well defined
      if(message != undefined) {
        attitude = data.estimateAttitudeComplementary(message.a_x, message.a_y, message.a_z, message.m_x, message.m_y, message.m_z, message.g_x, message.g_y, message.g_z, message.r, message.p, message.q, theta_hat_g_old, phi_hat_g_old, psi_hat_g_old, dt/60);
        // att = data.estimateAttitude(message.a_x,message.a_y,message.a_z, message.r, message.p, message.q, message.m_x,message.m_y,message.m_z, message.g_x, message.g_y, message.g_z, psi_hat, dt/60);
        // console.log(-message.a_y/message.a_x);
        // console.log(message);
        // console.log(att);
        // psi_hat = att.psi;

        // var vel = data.processAccellerationToVelocity(message.a_x, message.a_y, message.a_z, vx, vy, vz, dt/60);
        // vx = vel.vx;
        // vy = vel.vy;
        // vz = vel.vz;

        // var dist = data.processVelocityToDistance(vx, vy, vz, dx, dy, dz, dt/60);
        
        // console.log(asin(-message.a_y-message.g_y)*180/pi);
        // psi_hat = att.psi_hat;
        psi_hat_g_old = attitude.psi_hat_g_old;
        theta_hat_g_old = attitude.theta_hat_g_old;
        phi_hat_g_old = attitude.phi_hat_g_old;

      } else {
        console.error("Message is undefined!\n");
      }

      // if message contains attitude data
      //message.roll, message.pitch, message.yaw
      if(message.roll != undefined && message.yaw != undefined && message.pitch != undefined) {
        // var disp = data.calculateDisplacement(attitude.roll, attitude.pitch, attitude.yaw, last_x, last_y);
        var disp = data.calculateDisplacement(message.roll, message.pitch, message.yaw, last_x, last_y);
        var displacement_x = kf_x.filter(disp.d_x);
        var displacement_y = kf_y.filter(disp.d_y);
        // console.log(disp)
        // var disp = data.calculateDisplacement(att.roll, att.pitch, att.yaw);
        if( disp.d_x != undefined && disp.d_x != undefined) {
          last_x = disp.d_x;
          last_y = disp.d_x;
        } else {
          last_x = 0;
          last_y = 0;
        }
        
        setMousePosition(displacement_x, displacement_y);
        // if(opt_debug) console.log(message);
      } else {
        // else if message contains event data
        // console.log(message)
        if(message.leftMouseClick) {
          sendMouseLeftClick();
        } 
        if(message.rightMouseClick) {
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