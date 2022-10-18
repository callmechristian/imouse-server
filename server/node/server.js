var data = require('./process_data');
const { sendMouseLeftClick, sendMouseRightClick, setMousePosition, scrollEvent } = require('./mouse');


// websocket
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8000 });

// keyboard events
var robot = require('robotjs');

// filter
var KalmanFilter = require('kalmanjs')

// options
const opt_debug = true;

// global vars
var dt;
var time;
var prevTime = 0;
var dist_x = 0;
var dist_y = 0;

// kalmann filter classes; this served as a good hotfix for noisy input
var kf_y = new KalmanFilter({R: 0.01, Q: 3});
var kf_x = new KalmanFilter();
var kf_r = new KalmanFilter();
var kf_p = new KalmanFilter();
var kf_yaw = new KalmanFilter({R: 0.01, Q: 3});

// on websocket connect
wss.on('connection', (ws) => {
    console.log('Device connected.\n');

    // instantiate some important vars
    var last_x = 0;
    var last_y = 0;
    var psi_hat_g_old = 0;
    var theta_hat_g_old = 0;
    var phi_hat_g_old = 0;

    // on message received from client
    ws.on('message', (messageAsString) => {

      // calculate dataFrequency and packet delta
      time = Date.now();
      dt = time - prevTime;
      prevTime = time;

      // message-wide attitude data
      var attitude;

      // get JSON contents
      const message = JSON.parse(messageAsString);

      // check if message was well defined
      if(message != undefined) {
        attitude = data.estimateAttitudeComplementary(message.a_x, message.a_y, message.a_z, message.m_x, message.m_y, message.m_z, message.g_x, message.g_y, message.g_z, message.r, message.p, message.q, theta_hat_g_old, phi_hat_g_old, psi_hat_g_old, dt/60);
        
        /* old attitude estimation
        // att = data.estimateAttitude(message.a_x,message.a_y,message.a_z, message.r, message.p, message.q, message.m_x,message.m_y,message.m_z, message.g_x, message.g_y, message.g_z, psi_hat, dt/60);
        */

        // for recursion
        psi_hat_g_old = attitude.psi_hat_g_old;
        theta_hat_g_old = attitude.theta_hat_g_old;
        phi_hat_g_old = attitude.phi_hat_g_old;
      } else {
        console.error("Message is undefined!\n");
      }

      // if message contains attitude data
      //message.roll, message.pitch, message.yaw
      if(message.roll != undefined && message.yaw != undefined && message.pitch != undefined) {
        // instantiate kalmann filters for the roll pitch and yaw
        var kroll = kf_r.filter(message.roll);
        var kpitch = kf_p.filter(message.pitch);
        var kyaw = kf_yaw.filter(message.yaw);

        // map the roll pitch and yaw to screen size
        var disp = data.calculateDisplacement(message.roll, kpitch, kyaw, last_x, last_y);

        // instantiate kalmann filters for displacement
        var displacement_x = kf_x.filter(disp.d_x);
        var displacement_y = kf_y.filter(disp.d_y);

        // generally these kalmann filters smoothen out the noise

        // for thresholding
        if( disp.d_x != undefined && disp.d_x != undefined) {
          last_x = disp.d_x;
          last_y = disp.d_x;
        } else {
          last_x = 0;
          last_y = 0;
        }
        
        // move the mouse
        setMousePosition(displacement_x, displacement_y);
        if(opt_debug) console.log(message);
      } else {
        // else if message contains event data
        if(message.leftMouseClick) {
          sendMouseLeftClick();
        } 
        if(message.rightMouseClick) {
          sendMouseRightClick();
        }
        if(message.switchTab) {
          robot.keyTap("tab", "control");
        }
        if(message.missionCtrl) {
          robot.keyTap("tab", "command");
        }
        if(message.switchToLaser) {
          robot.keyTap("l", "control");
        }
        if(message.scroll != undefined) {
          scrollEvent(message.scroll);
        }
        if(message.leftArrow) {
          robot.keyTap("left");
        }
        if(message.rightArrow) {
          robot.keyTap("right");
        }
      }
    });  
});

// on websocket exit
wss.on("close", () => {
  console.log("\nWebsocket closed.\n")
});

console.log("Web socket online.\n");