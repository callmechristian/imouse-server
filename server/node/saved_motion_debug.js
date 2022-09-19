var data = require('./process_data');
var log = require('../../logs/usagelog.json');
var mean = require('./determine_offset');


let {PythonShell} = require('python-shell')
let pyshell = new PythonShell('../python/movemouse.py');

// sends a message to the Python script via stdin

//group accel data by 10 messages at one time
var _counter = 0;
var _index = 0;
var newLog = [{"x": 0, "y": 0, "z":0}];
for (const a in log){
    if (_counter < 10) {
        newLog[_index].x += log[a].x - mean.mean_x; //remove computed offset
        newLog[_index].y += log[a].y - mean.mean_y; //remove computed offset
        newLog[_index].z += log[a].z - mean.mean_z; //remove computed offset
        _counter++;
    } else {
        _counter = 0;
    }
    // console.log(a);
}

for (const a in newLog) {
  var v = data.processAccellerationToVelocity(log[a].x*10000, log[a].y*10000, log[a].z*10000, 0, 0, 0, 1/60);

  var d = data.estimateNewMouseDisplacement(0, 0, 0, v.vx, v.vy, v.vz, 1/60);

  dist_x = d.x;
  dist_y = d.y;
//   console.log(d.x*10000000 + ' ' + d.y*10000000 + ' ' + d.z*10000000);
  var str = Math.floor(dist_x) + ' ' + Math.floor(dist_y);

  pyshell.send(str);
  console.log(str);
}

pyshell.on('message', function (message) {
  // received a message sent from the Python script (a simple "print" statement)
  console.log(message);
});

var options = {
    scriptPath: '../python/'
};

const { exit } = require('process');

var prevTime = Date.now();

function exitProcess() {
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

setInterval(moveTheMouse, 100);