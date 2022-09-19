const varToString = varObj => Object.keys(varObj)[0];
var fs = require("fs");

module.exports={
    initLog: function(name) {
        fs.writeFile("../../logs/log_" + nr + "_" + name + ".json","[\n");
        var nr = parseInt(fs.readFile("../../logs/DATA"));
        fs.writeFile("../../logs/DATA", nr);
    },

    logToJSON: function(obj, path) {
        var JSON = {};
        for(a in obj) {
            JSON[varToString(obj[a])] = obj[a];
        }
        fs.appendFile(path, JSON.toString(), (err) => {
            if (err) {
              console.log(err);
            }
            else {
              // Get the file contents after the append operation
              console.log("\nLogged:" + JSON.toString());
           }
        });
    },

    endLog: function() {
        fs.appendFile(path, JSON.toString(), (err) => {
            if (err) {
              console.log(err);
            }
            else {
              // Get the file contents after the append operation
              console.log("\nLogged:" + JSON.toString());
           }
        });
    }


}