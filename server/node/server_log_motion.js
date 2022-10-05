var log = require('./logging');
var data = require('./process_data');

log.initLog("motion_sample_left_right_up_down");

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 7071 });

//timestamps
var prevTime = Date.now();
var dist_x = 0;
var dist_y = 0;
var psi_hat = 0;

//called every 50ms
function moveTheMouse() {
    var str = Math.floor(dist_x) + ' ' + Math.floor(dist_y);
    pyshell.send(str);
    dist_x = 0;
    dist_y = 0;
  }

  wss.on('connection', (ws) => {
    clients.set(wss);

    //only displace mouse every 50ms
    setInterval(moveTheMouse, 50);
    console.log('connected')

    ws.on('message', (messageAsString) => {
      time = Date.now();
      dt = time - prevTime;
      prevTime = time;

      const message = JSON.parse(messageAsString);
      // console.log(message)
      if(message != undefined) {
        log.logObjToJSON(message);
        log.logStr(",");
        var att = data.estimateAttitude(message.x,message.y,message.z, message.m_x,message.m_y,message.m_z, message.g_x, message.g_y, message.g_z, dt/60, psi_hat)
        psi_hat = att.psi_hat;
      }      
    });  
});

wss.on("close", () => {
    log.logStr("{}");
    log.endLog();
  clients.delete(ws);
});