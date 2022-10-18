var log = require('../../logs/log_standing_still.json');

module.exports = {
    getMeanOffsetsFromLog: function() {
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
    },

    determineMeanAccelerometerOffsets: function(array_accel_x, array_accel_y, array_accel_z) {
        // the computed offsets are initialized with 0
        var computed_offset_x = 0;
        var computed_offset_y = 0;
        var computed_offset_z = 0;

        var samples = array_accel_x.length;

        // number of xyz samples should be the same no need for different for loops
        for(i in array_accel_x) {
            computed_offset_x += array_accel_x[i];
            computed_offset_y += array_accel_y[i];
            computed_offset_z += array_accel_z[i];
        }

        // divide by the number of samples to get the mean
        computed_offset_x = computed_offset_x/samples;
        computed_offset_y = computed_offset_y/samples;
        computed_offset_z = computed_offset_z/samples;

        var _ret = {
            accel_offset_x: computed_offset_x,
            accel_offset_y: computed_offset_y,
            accel_offset_z: computed_offset_z
        }

        return _ret;
    },

    determineMeanGyrometerOffsets: function(array_gyro_x, array_gyro_y, array_gyro_z) {
        // the computed offsets are initialized with 0
        var computed_offset_x = 0;
        var computed_offset_y = 0;
        var computed_offset_z = 0;

        var samples = array_gyro_x.length;

        // number of xyz samples should be the same no need for different for loops
        for(i in array_accel_x) {
            computed_offset_x += array_gyro_x[i];
            computed_offset_y += array_gyro_y[i];
            computed_offset_z += array_gyro_z[i];
        }

        // divide by the number of samples to get the mean
        computed_offset_x = computed_offset_x/samples;
        computed_offset_y = computed_offset_y/samples;
        computed_offset_z = computed_offset_z/samples;

        var _ret = {
            gyro_offset_x: computed_offset_x,
            gyro_offset_y: computed_offset_y,
            gyro_offset_z: computed_offset_z
        }

        return _ret;
    }
}
