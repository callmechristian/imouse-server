const varToString = varObj => Object.keys(varObj)[0];
var fs = require("fs");
var absPath = "";
exports.path = absPath;

module.exports={
    initLog: function(name) {
        fs.writeFile("../../logs/log_" + nr + "_" + name + ".json","[\n");
        var nr = parseInt(fs.readFile("../../logs/DATA"));
        fs.writeFile("../../logs/DATA", nr);
        absPath = "../../logs/log_" + nr + "_" + name + ".json";
    },

    logToJSON: function(obj) {
        var JSON = {};
        for(a in obj) {
            JSON[varToString(obj[a])] = obj[a];
        }
        fs.appendFile(absPath, JSON.toString(), (err) => {
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
        fs.appendFile(absPath, JSON.toString(), (err) => {
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