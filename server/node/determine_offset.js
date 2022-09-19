var log = require('../../logs/log_standing_still.json');

module.exports = {
    getMeanOffsets: function() {
        var mean_x = 0;
        var mean_y = 0;
        var mean_z = 0;

        for (const a in log){
            mean_x += log[a].x;
            mean_y += log[a].y;
            mean_z += log[a].z;
        }

        var len = log.length;

        mean_x = mean_x/len;
        mean_y = mean_x/len;
        mean_z = mean_z/len;

        // console.log("Mean x: " + mean_x);
        // console.log("Mean y: " + mean_y);
        // console.log("Mean z: " + mean_z);
        return {"mean_x": mean_x, "mean_y": mean_y, "mean_z": mean_z};
    }
}
