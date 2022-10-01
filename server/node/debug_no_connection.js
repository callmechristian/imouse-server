const {getCursorPosition, setCursorPosition, sendCursorEvent, cursorEvents} = require("node-cursor");
var data = require('./process_data');
var datalog = require('../../logs/log_44.json');
const { estimateAttitude } = require("./process_data");
const { setRelativeMousePosition } = require("./mouse");

//options
const opt_debug = true;

if(opt_debug == true) {
    console.log("Debugger ON\n");
}

//timestamps
var psi_hat = 0;

//move mouse relative to the current position

console.log("Starting log 44 movement with 60 Hz...\n");

//count the log length
var computeSteps = datalog.length;
var currentSteps = 0;
function compute() {
    if(currentSteps < computeSteps) {
        try {
            var parse = datalog[currentSteps];

            //estimate attitude
            var att = estimateAttitude(parse.x, parse.y, parse.z, parse.m_x, parse.m_y, parse.m_z, parse.g_x, parse.g_y, parse.g_z, 1/60, parse.psi_hat);
            psi_hat = att.psi_hat;

            //debug log
            if(opt_debug == true) {
                console.log("roll: " + att.roll);
                console.log("pitch: " + att.pitch);
                console.log("yaw: " + att.yaw);
            }
        
            //move the mouse
            setRelativeMousePosition(0, att.pitch);
        } catch(e) {
            console.log(e);
        };
        currentSteps += 1;
    }
}

//compute and move mouse 60 times every second
setInterval(compute, 1000/60);