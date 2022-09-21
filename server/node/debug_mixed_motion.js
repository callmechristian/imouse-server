var data = require('./process_data');

//called every 50ms
function moveTheMouse() {
    var str = Math.floor(dist_x) + ' ' + Math.floor(dist_y);
    pyshell.send(str);
    dist_x = 0;
    dist_y = 0;
}

//timestamps
var prevTime = Date.now();
var dist_x = 0;
var dist_y = 0;
var psi_hat = 0;