module.exports = {
    processAccellerationToVelocity: function(ax, ay, az, vx, vy, vz, dataFrequency) {

        velocity_x = vx + ax*dataFrequency;
        velocity_y = vy + ay*dataFrequency;
        velocity_z = vz + az*dataFrequency;

        return {velocity_x, velocity_y, velocity_z};
    },

    estimateNewMouseDisplacement: function(x, y, z, vx, vy, vz) {
        next_x = x + vx;
        next_y = y + vy;
        next_z = z + vz;

        return {next_x, next_y, next_z}
    }
};