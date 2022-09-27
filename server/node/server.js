var data = require('./process_data');
// var log = require('../../logs/usagelog.json');
var meanOffset = require('./determine_offset');
var log = require('./logging');
// log.initLog("motion_sample_left_right_up_down");

var bag = require('../../logs/log_33_motion_sample_left_right_up_down.json');

//instantiate python shell with stdin to run in parallel
// let {PythonShell} = require('python-shell')
// let pyshell = new PythonShell('../python/movemouse.py');

const fs = require('fs');

const {exit} = require('process');

// data.estimateAttitude()

// old_yaw = 0
// old_pitch = 0
// for (const a in bag){
//   // pitch = bag[a].pitch + 90
//   pitch = 6*(-bag[a].pitch)+394
//   if (pitch < 0){
//     pitch = 0
//   }
//   yaw = bag[a].yaw
//   // if (Math.abs(yaw-old_yaw) > 10 || Math.abs(pitch-old_pitch) > 10){
//     var str = yaw + ' ' + pitch;
//     // pyshell.send(str);
//     console.log(yaw, pitch)
//     old_yaw = yaw
//     old_pitch = pitch
//   // }
  
  
// }

// exit()
// sends a message to the Python script via stdin
// sends a message to the Python script via stdin
// for (const a in log){
//   var v = data.processAccellerationToVelocity(log[a].x, log[a].y, log[a].z, 0, 0, 0, 60);
//   var d = data.estimateNewMouseDisplacement(0, 0, 0, v.vx, v.vy, v.vz, 1/60);

//   // console.log(d);
//   var str = Math.floor(d.x) + ' ' + Math.floor(d.y);

//   // pyshell.send(str);
// }

//for debug purposes
/*
pyshell.on('message', function (message) {
  // received a message sent from the Python script (a simple "print" statement)
  console.log("Pymsg: " + message);
});
*/
// console.log("hello")
// pyshell.send("100 100");
// console.log("world")

// const spawn = require("child_process").spawn;
// const pythonProcess = spawn('python3',["-u", "../python/movemouse.py"]);
// pythonProcess.stdout.on('data', (data) => {
//   console.log("PYTHON SENT:", data.toString());
// });

// let count = 0;

// setInterval(function() {
//   // pythonProcess.stdin.write(`12345:2 analogInput ${count++}\n`);
//   pyshell.send("200 200")
//   console.log("eaef")
// }, 1000);

// pyshell.on('message', function (message) {
//   // received a message sent from the Python script (a simple "print" statement)
//   console.log("Pymsg: " + message);
// });

function getMessage(pyshell) {
  console.log("ejfon")
  return new Promise((resolve, reject) => {
    console.log("aefa")
      pyshell.on('message', message => {
          resolve(message);
          
          // }
      });
      pyshell.on('error', err => {
          reject(err);
      });
  });
}
let {PythonShell} = require('python-shell')
let pyshell = new PythonShell('../python/movemouse.py');
(async () => {
  // ...

  console.log("hello")
  pyshell.send("100 100");
  console.log("world")
  const message = await getMessage(pyshell);
  console.log(`awaited message: ${message}`)
  old_yaw = 0
  old_pitch = 0
  // for (const a in bag){
  //   // pitch = bag[a].pitch + 90
  //   pitch = 6*(-bag[a].pitch)+394
  //   if (pitch < 0){
  //     pitch = 0
  //   }
  //   yaw = bag[a].yaw
  //   if (Math.abs(yaw-old_yaw) > 10 || Math.abs(pitch-old_pitch) > 10){
  //     var str = yaw + ' ' + pitch;
  //     pyshell.send(str);
  //     console.log(yaw, pitch)
  //     old_yaw = yaw
  //     old_pitch = pitch
  //   }
  // }
  setInterval(moveTheMouse, 100);

})();

// function foo() {
//   console.log("foo")
//   pyshell.send("200 200")
// }
// pyshell.on('message', function (message) {
//   console.log(message);
//   foo()
//   });
// pyshell.end(function (err) {
//   if (err) {
//   throw err;
//   };
//   console.log('done');
//   });
// var options = {
//   scriptPath: '../python/'
// };

// return new Promise((resolve,reject) =>{
//   try{
//     pyshell.send(pythonFile, options, function(err, results) {
//       if (err) {console.log(err);}
//       // results is an array consisting of messages collected during execution
//       console.log('results', results);
//       resolve();          
//     }); 
//   }
//   catch{
//     console.log('error running python code')
//     reject();
//   }
// })

// exit()

const WebSocket = require('ws');
const { waitForDebugger } = require('inspector');
const { sluDependencies } = require('mathjs');

const wss = new WebSocket.Server({ port: 7071 });
const clients = new Map();

//timestamps
var prevTime = Date.now();
var dist_x = 0;
var dist_y = 0;

//called every 100ms
function moveTheMouse() {
  var str = Math.floor(dist_x) + ' ' + Math.floor(dist_y);
  console.log(dist_x, dist_y)

  var str = dist_x + ' ' + dist_y

  if (dist_x < 0 || dist_y < 0){
    console.log("error")
  }
  else {
    
    pyshell.send(str);
  }
  // dist_x = 0;
  // dist_y = 0;
}

var offsets = meanOffset.getMeanOffsets();

wss.on('connection', (ws) => {
    const id = uuidv4();
    const color = Math.floor(Math.random() * 360);
    const metadata = { id, color };

    clients.set(ws, metadata);

    //only displace mouse every 100ms
    // setInterval(moveTheMouse, 100);

    var i = 0
    var psi_old = 0
    ws.on('message', (messageAsString) => {
      i += 1
      if (i > 0) {
        // i=0
        
        time = Date.now();
        dt = time - prevTime;
        prevTime = time;
  
        const message = JSON.parse(messageAsString);
        g_z = message.g_z
        if (Math.abs(g_z) < 0.01 )
        {
          g_z = 0
        }
        // console.log(message.g_z)
        // console.log('a_x: ', message.x, 'a_y:', message.y,  'a_z: ', message.z)
        // console.log('a_y: ', message.y, message.m_y)
        // console.log('m_x: ', message.m_x,'m_y: ', message.m_y,'m_z: ', message.m_z)
        
        var v = data.estimateAttitude(message.x,message.y,message.z, message.m_x,message.m_y,message.m_z, message.g_x, message.g_y, g_z, psi_old, dt)
        psi_old = v.psi
        console.log('roll: ', v.roll, 'pitch: ', v.pitch, 'yaw: ', v.yaw)

        // log.logObjToJSON(message);
        // log.logStr(",");
        // dist_x = v.yaw
        pitch = 6*(-v.pitch)+394
        dist_y = pitch

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