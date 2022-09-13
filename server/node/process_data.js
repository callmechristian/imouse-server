export const processAccellerationToVelocity = (ax, ay, az, vx, vy, vz, dataFrequency) => {

        velocity_x = vx + ax*dataFrequency;
        velocity_y = vy + ay*dataFrequency;
        velocity_z = vz + az*dataFrequency;

        var _ret = {
            vx: velocity_x,
            vy: velocity_y,
            vz: velocity_z
        }

        return _ret;
}

export const estimateNewMouseDisplacement = (x, y, z, vx, vy, vz) => {
        next_x = x + vx;
        next_y = y + vy;
        next_z = z + vz;

        var _ret = {
            x: next_x,
            y: next_y,
            z: next_z
        }

        return _ret;
}