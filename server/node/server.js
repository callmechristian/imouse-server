var data = require('./process_data');
var log = require('../../logs/usagelog.json');
var meanOffset = require('./determine_offset');

//instantiate python shell with stdin to run in parallel
let {PythonShell} = require('python-shell')
let pyshell = new PythonShell('../python/movemouse.py');

const fs = require('fs');

const {exit} = require('process');

data.estimateAttitude(0,1,-1,20*Math.pow(10,-9),20*Math.pow(10,-9),20*Math.pow(10,-9))
// exit()

// sends a message to the Python script via stdin
for (const a in log){
  var v = data.processAccellerationToVelocity(log[a].x, log[a].y, log[a].z, 0, 0, 0, 60);
  var d = data.estimateNewMouseDisplacement(0, 0, 0, v.vx, v.vy, v.vz, 1/60);

  // console.log(d);
  var str = Math.floor(d.x) + ' ' + Math.floor(d.y);
  
  // pyshell.send(str);
}


//for debug purposes
/*
pyshell.on('message', function (message) {
  // received a message sent from the Python script (a simple "print" statement)
  console.log("Pymsg: " + message);
});
*/

var options = {
  scriptPath: '../python/'
};

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 7071 });
const clients = new Map();

//timestamps
var prevTime = Date.now();
var dist_x = 0;
var dist_y = 0;

//called every 100ms
function moveTheMouse() {
  var str = Math.floor(dist_x) + ' ' + Math.floor(dist_y);
  pyshell.send(str);
  dist_x = 0;
  dist_y = 0;
}

var offsets = meanOffset.getMeanOffsets();

wss.on('connection', (ws) => {
    const id = uuidv4();
    const color = Math.floor(Math.random() * 360);
    const metadata = { id, color };

    clients.set(ws, metadata);

    //only displace mouse every 100ms
    setInterval(moveTheMouse, 100);
    console.log('connected')

    var i = 0
    ws.on('message', (messageAsString) => {
      i += 1
      if (i > 60) {
        i=0
        time = Date.now();
        dt = time - prevTime;
        prevTime = time;
  
        const message = JSON.parse(messageAsString);

        // console.log('a_x: ', message.x, 'a_y:', message.y,  'a_z: ', message.z)
        // console.log('a_y: ', message.y, message.m_y)
        // console.log('m_x: ', message.m_x,'m_y: ', message.m_y,'m_z: ', message.m_z)
        
        var v = data.estimateAttitude(message.x,message.y,message.z, message.m_x,message.m_y,message.m_z)
        console.log('roll: ', v.roll, 'pitch: ', v.pitch, 'yaw: ', v.yaw)

      }

      // }      
    });  
});

wss.on("close", () => {
  clients.delete(ws);
});

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

console.log("wss up");