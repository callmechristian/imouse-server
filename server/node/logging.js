var fs = require("fs");
var absPath = "";
exports.path = absPath;

module.exports={
    initLog: function(name) {
        var nr = 0;

        const data = fs.readFileSync("../../logs/DATA", 'utf-8');
        nr = parseInt(data);
        console.log("Nr read is:" + nr);

        var _str = "../../logs/log_" + nr + "_" + name + ".json";

        fs.writeFileSync(_str,"[\n");
        absPath = "../../logs/log_" + nr + "_" + name + ".json";
        console.log("Path is:");
        console.log(absPath);

        fs.writeFileSync("../../logs/DATA", (++nr).toString());
        console.log("writing to data:" + nr);

    },

    logObjToJSON: function(obj) {
        var newObj = {};
        for(i = 0; i < Object.keys(obj).length; i++) {
            newObj[Object.keys(obj)[i]] = obj[Object.keys(obj)[i]];
            // console.log(newObj);
        }
        fs.appendFile(absPath, JSON.stringify(newObj), (err) => {
            if (err) {
              console.log(err);
            }
            else {
              // Get the file contents after the append operation
            //   console.log("\nLogged:" + newObj.toString());
           }
        });
    },

    logStr: function(string) {
        fs.appendFile(absPath, string, (err) => {
            if (err) {
              console.log(err);
            }
        });
    },

    endLog: function() {
        fs.appendFile(absPath, "\n]", (err) => {
            if (err) {
              console.log(err);
            }
            else {
              // Get the file contents after the append operation
            //   console.log("\nLogged:" + newObj.toString());
           }
        });
    }


}