var data = require('./process_data');
var log = require('../../logs/usagelog.json');
var meanOffset = require('./determine_offset');


let {PythonShell} = require('python-shell')
let pyshell = new PythonShell('../python/movemouse.py');

const fs = require('fs');

// sends a message to the Python script via stdin

for (const a in log){
  //console.log(log[a].x)
  // var v = data.processAccellerationToVelocity(log[a].x, log[a].y, log[a].z, 0, 0, 0, 60);
  // var d = data.estimateNewMouseDisplacement(0, 0, 0, v.vx, v.vy, v.vz);

  var v = data.processAccellerationToVelocity(log[a].x, log[a].y, log[a].z, 0, 0, 0, 60);
  var d = data.estimateNewMouseDisplacement(0, 0, 0, v.vx, v.vy, v.vz, 1/60);

  // console.log(d);
  var str = Math.floor(d.x) + ' ' + Math.floor(d.y);

  // pyshell.send(str);
}

pyshell.on('message', function (message) {
  // received a message sent from the Python script (a simple "print" statement)
  console.log("Pymsg: " + message);
});

var options = {
scriptPath: '../python/'
};

const WebSocket = require('ws');
const { exit } = require('process');


const wss = new WebSocket.Server({ port: 7071 });
const clients = new Map();

var prevTime = Date.now();

function printLastDisplacement() {
   process.exit(0);
}

var dist_x = 0;
var dist_y = 0;

function moveTheMouse() {
  var str = Math.floor(dist_x) + ' ' + Math.floor(dist_y);
  // console.log(str);
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

    setInterval(moveTheMouse, 100);

    ws.on('message', (messageAsString) => {
      time = Date.now();
      dt = time - prevTime;
      prevTime = time;

      const message = JSON.parse(messageAsString);
      const metadata = clients.get(ws);

      // debug message
      if(message != undefined) {
        var v = data.processAccellerationToVelocity(message.x - offsets.mean_x, -message.y + offsets.mean_y, message.z - offsets.mean_z, 0, 0, 0, dt/1000);

        if(Math.abs(message.x) <= 0.01 && Math.abs(message.y) <= 0.02) {
          // console.log("Reset vel");
          v.vx = 0;
          v.vy = 0;
          v.vz = 0;
        }

        var d = data.estimateNewMouseDisplacement(0, 0, 0, v.vx, v.vy, v.vz, dt/1000);

        dist_x = d.x*10000;
        dist_y = d.y*10000;
        
        // console.log(dist_x);
        // console.log(dist_y);

        // write to file log
        // fs.appendFile('../../logs/lastSession.json', obj.toString(), err => {
        //   if (err) {
        //     console.error(err);
        //   }
        // });
        
        // console.log(message.x)
      }

      // process the data
      //run py script with new x y z

      

      // console.log(v.vx + " " + v.vy + " " + v.vz);
      // console.log("Computed x: " + d.x + " Computed y: " + d.y);
      // move mouse using shell
      

      message.sender = metadata.id;
      message.color = metadata.color;

      [...clients.keys()].forEach((client) => {
        client.send(JSON.stringify(message));
      });
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
// end the input stream and allow the process to exit
// pyshell.end(function (err,code,signal) {
//   if (err) throw err;
//   console.log('The exit code was: ' + code);
//   console.log('The exit signal was: ' + signal);
//   console.log('finished');
// });