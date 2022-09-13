var data = require('./process_data');
var log = require('../../logs/usagelog.json');


for (const a in log){
  //console.log(log[a].x)
  var v = data.processAccellerationToVelocity(log[a].x, log[a].y, log[a].z, 0, 0, 0, 60);
  var d = data.estimateNewMouseDisplacement(0, 0, 0, v.vx, v.vy, v.vz);
  console.log(d)
}

const WebSocket = require('ws');

const { exec } = require('node:child_process')

// run the `ls` command using exec
exec('python ../python/movemouse.py 100 100', (err, output) => {
    // once the command has completed, the callback function is called
    if (err) {
        // log and return if we encounter an error
        console.error("could not execute command: ", err)
        return
    }
    // log the output received from the command
    console.log("Output: \n", output)
})

const wss = new WebSocket.Server({ port: 7071 });
const clients = new Map();

wss.on('connection', (ws) => {
    const id = uuidv4();
    const color = Math.floor(Math.random() * 360);
    const metadata = { id, color };

    clients.set(ws, metadata);

    ws.on('message', (messageAsString) => {
      const message = JSON.parse(messageAsString);
      const metadata = clients.get(ws);

      // debug message
      if(message.msg != undefined) {
        console.log(message);
        console.log(message.x)
      }

      // process the data
      var v = data.processAccellerationToVelocity(message.x, message.y, message.z, 0, 0, 0, 60);
      var d = data.estimateNewMouseDisplacement(0, 0, 0, v.vx, v.vy, v.vz);
      //run py script with new x y z
      

      console.log(v.vx + " " + v.vy + " " + v.vz);
      console.log("Computed x: " + d.x + " Computed y: " + d.y);
      // move mouse
      const pythonProcess = spawn('python3',["/python/movemouse.py", d.x, d.y])

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