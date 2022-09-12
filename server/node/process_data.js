function processAccellerationToVelocity(ax, ay, az, vx, vy, vz, dataFrequency) {

    velocity_x = vx + ax*dataFrequency;
    velocity_y = vy + ay*dataFrequency;
    velocity_z = vz + az*dataFrequency;

    return {velocity_x, velocity_y, velocity_z};
}