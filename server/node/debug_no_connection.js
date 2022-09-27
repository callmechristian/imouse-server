// var log = require('./logging');
const {getCursorPosition, setCursorPosition, sendCursorEvent, cursorEvents} = require("node-cursor");
var data = require('./process_data');
var datalog = require('../../logs/log_44.json');
const { estimateAttitude } = require("./process_data");
const { raw } = require("express");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// log.initLog("motion_sample_left_right_up_down");

// const WebSocket = require('ws');
// const wss = new WebSocket.Server({ port: 7071 });

//timestamps
var prevTime = Date.now();
var dist_x = 0;
var dist_y = 0;
var psi_hat = 0;


function relativeMousePosition(_x, _y) {
    var new_x = 0;
    var new_y = 0;
    var currentPos = getCursorPosition();

    new_x = currentPos.x + _x;
    new_y = currentPos.y + _y;

    setCursorPosition({x:new_x,y:new_y});
}

//   wss.on('connection', (ws) => {
    // clients.set(wss);

    //only displace mouse every 50ms
    // setInterval(moveTheMouse, 50);
    // console.log('connected')

    // ws.on('message', (messageAsString) => {

console.log("Starting log 44 movement with 60 Hz");


var computeSteps = datalog.length;
var currentSteps = 0;
function compute() {
    if(currentSteps < computeSteps) {
        try {
            var parse = datalog[currentSteps];
            // console.log("data:" + datalog[index].s);
            var att = estimateAttitude(parse.x, parse.y, parse.z, parse.m_x, parse.m_y, parse.m_z, parse.g_x, parse.g_y, parse.g_z, 1/60, parse.psi_hat);
            psi_hat = att.psi_hat;

            console.log("roll: " + att.roll);
            console.log("pitch: " + att.pitch);
            console.log("yaw: " + att.yaw);
        
            relativeMousePosition(0, att.pitch);
        } catch(e) {
            console.log(e);
        };
        currentSteps += 1;
    }
}

setInterval(compute, 1000/60);


    // }); 
// });

// wss.on("close", () => {
//     log.logStr("{}");
//     log.endLog();
//   clients.delete(ws);
// });