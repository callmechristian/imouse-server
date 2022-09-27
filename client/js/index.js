(async function() {
    const ws = await connectToServer();

    var pitch = 0; //-60 to 60
    var roll = 0; //doesnt matter
    var yaw = 0; //-45 to 45

    const display_roll = document.getElementById('roll');
    const display_pitch = document.getElementById('pitch');
    const display_yaw = document.getElementById('yaw');

    attitude = {
        "pitch": pitch,
        "roll": roll,
        "yaw": yaw
    }

    function changePitch(i) {
        if(i >= 0) {
            if((attitude.pitch < 60) && (attitude.pitch > -60)) {
                attitude.pitch += i;
                updateValues();
            }
        }
    }

    function changeRoll(i) {
        if(i >= 0) {
            if((attitude.yaw < 40) && (attitude.yaw > -40)) {
                attitude.yaw += i;
                updateValues();
            }
        }
    }

    function updateValues() {
        display_roll.innerHTML = "Roll: " + roll;
        display_pitch.innerHTML = "Pitch: " + pitch;
        display_yaw.innerHTML = "Yaw: " + yaw;
    }

    document.body.onkeydown("37") = (evt) => {
        changeRoll(-1);
        ws.send(JSON.stringify(attitude));
    }; //left
    document.body.onkeydown("38") = (evt) => {
        changePitch(1);      
        ws.send(JSON.stringify(attitude));
    }; //up
    document.body.onkeydown("39") = (evt) => {
        changeRoll(1);
        ws.send(JSON.stringify(attitude));
    }; //right
    document.body.onkeydown("40") = (evt) => {
        changePitch(-1);
        ws.send(JSON.stringify(attitude));
    }; //down
        
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