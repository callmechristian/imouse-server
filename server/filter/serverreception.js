const Websocket=require('ws');
const wss=new Websocket.Server({port: 7071});
var filter=require("./filter.js");
//import {firacc} from  "./filer.js";
//var log=require("log.json");
const fs= require('fs');
const clients = new Map();

function firacc(acc,preacc,pinacc){
  var res={
    x: 0,
    y: 0,
    z: 0
  }
  const a2=-0.922;
  const b1=0.0390*10000;
  const b2=0.0390*10000;
  res.x=b1*acc.x+b2*pinacc.x-a2*preacc.x;
  res.y=b1*acc.y+b2*pinacc.y-a2*preacc.y;
  res.z=b1*acc.z+b2*pinacc.z-a2*preacc.z;
  return res;
}
var preacc={
    x:0,
    y:0,
    z:0
};
var pinacc={
    x:0,
    y:0,
    z:0
};
var acc={
  x:0,
  y:0,
  z:0
}
wss.on('connection', (ws) => {
    console.log("connected");
    const id = uuidv4();
    const color = Math.floor(Math.random() * 360);
    const metadata = { id, color };

    clients.set(ws, metadata);
    ws.on('message',(messageasstring) =>{
      console.log("recieved");
      const message = JSON.parse(messageasstring);
      console.log(message);
      //var acc={
      //  x: message.x,
      //  y: message.y,
      //  z: message.z
      //}
      acc=message[0];//In order to get ride of the [] in the json
      console.log("acc");
      console.log(acc);
      //console.log(acc);
      resacc=firacc(acc,preacc,pinacc);
      preacc=resacc;
      console.log(resacc);
      var stringtowrite={};
      fs.readFile("./output.json",'utf8',(err,jsonstring)=>{
        jsonresacc=JSON.stringify(resacc);
        stringtowrite=stringtowrite.concat(jsonresacc);
       
      })//we don't use the writeFile function here because we need no callback
      fs.writeFileSync("./output.json",stringtowrite);
    })
    })

    wss.on("close", () => {
        clients.delete(ws);
      });
      
      
      function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }