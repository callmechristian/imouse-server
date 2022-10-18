(async function() {
    const ws = await connectToServer();

    const opt_debug = false;

    var pitch = 0; //-45 to 45
    var roll = 0; //doesnt matter
    var yaw = 0; //-60 to 60

    var display_roll;
    var display_pitch;
    var display_yaw;

    window.onload = function(evt) {
        display_roll = document.getElementById("roll");
        display_pitch = document.getElementById("pitch");
        display_yaw = document.getElementById("yaw");

        updateValues();
    }

    var attitude = {
        "pitch": pitch,
        "roll": roll,
        "yaw": yaw
    }

    function changePitch(i) {
        attitude.pitch += i;
        if(attitude.pitch > 40) {
            attitude.pitch = 40;
        }
        if(attitude.pitch < -40) {
            attitude.pitch = -40;
        }
    }

    function changeRoll(i) {
        attitude.yaw += i;
        if(attitude.yaw > 60) {
            attitude.yaw = 60;
        }
        if(attitude.yaw < -60) {
            attitude.yaw = -60;
        }
    }

    function updateValues() {
        display_roll.innerText = "Roll: " + attitude.roll;
        display_pitch.innerText = "Pitch: " + attitude.pitch;
        display_yaw.innerText = "Yaw: " + attitude.yaw;
    }

    window.onkeydown = function(evt) {
        // console.log(evt.key);
        switch(evt.key) {
            case "ArrowLeft":
                if(opt_debug) console.log("left");
                changeRoll(-1);
                updateValues();
                break; //left
            case "ArrowUp":
                if(opt_debug) console.log("up");
                changePitch(1);  
                updateValues();
                break; //up
            case "ArrowRight":
                if(opt_debug) console.log("right");
                changeRoll(1);
                updateValues();
                break; //right
            case "ArrowDown":
                if(opt_debug) console.log("down");
                changePitch(-1);
                updateValues();
                break; //down
            default:
                break;
        }
    };

    setInterval(() => {
        ws.send(JSON.stringify(attitude));
    }, Math.round(1000/60));
        
    async function connectToServer() {    
        const ws = new WebSocket('ws://localhost:7071/ws');
        return new Promise((resolve, reject) => {
            const timer = setInterval(() => {
                if(ws.readyState === 1) {
                    clearInterval(timer);
                    resolve(ws);
                }
            }, 10);
        });   
    }
})();