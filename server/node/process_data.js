const {pi, abs, sin, cos, round, atan, asin, floor, sqrt} = require('mathjs');

function mapYaw(psi_hat) {
    psi_hat += 1600;
    psi_hat *= 360/3200;
    yaw = psi_hat - 180;

    return yaw;
}

module.exports = {   
    processAccellerationToVelocity: function(ax, ay, az, vx, vy, vz, dataFrequency) {
        /*
        Integrate the ax, ay, az acceleration into vx, vy, vz velocities.
        */
        var velocity_x = vx + ax*dataFrequency;
        var velocity_y = vy + ay*dataFrequency;
        var velocity_z = vz + az*dataFrequency;

        var _ret = {
            vx: velocity_x,
            vy: velocity_y,
            vz: velocity_z
        }

        return _ret;
    },

    processVelocityToDistance: function(vx,vy,vz, dx, dy, dz, dataFrequency) {
        /*
        Integrate the vx, vy, vz velocity into dx, dy, dz distances.
        */
       var distance_x = dx + vx*dataFrequency;
       var distance_y = dy + vy*dataFrequency;
       var distance_z = dz + vz*dataFrequency;

       var _ret = {
            dx: distance_x,
            dy: distance_y,
            dz: distance_z
       }

       return _ret;
    },

    processAccellerationToDistance: function(ax, ay, az, vx, vy, vz, dx, dy, dz, dataFrequency) {
        /*
        Uses processAccelerationToVelocity and processVelocityToDistance consecutively to determine distance. QoL function.
        */
        var velocities = this.processAccellerationToVelocity(ax, ay, az, vx, vy, vz, dataFrequency);
        var distances = this.processVelocityToDistance(velocities.vx, velocities.vy, velocities.vz, dx, dy, dz, dataFrequency);
        return distances;
    },

    estimateNewMouseDisplacement: function(x, y, z, vx, vy, vz, dataFrequency) {
        next_x = x + vx*dataFrequency;
        next_y = y + vy*dataFrequency;
        next_z = z + vz*dataFrequency;

        var _ret = {
            x: next_x,
            y: next_y,
            z: next_z
        }

        return _ret;
    },

    estimateAttitude: function(a_x, a_y, a_z, m_x, m_y, m_z, g_x, g_y, g_z, psi_old, dt){
        /*
        Estimate attitude from accelerometer data for pitch and roll, gyrometer data for yaw. No magnetometer.
        */

        // let initial values be non-zero
        phi = pi/3;
        theta = pi/3;
        psi = pi/4;
        g = 9.81;
        
        // rotation matrix
        C = [-sin(theta), sin(phi) * cos(theta), cos(phi)*cos(theta)] // Cn_b * e_3

        // estimated roll
        theta_hat = asin(-a_y*g/g);
        // estimated pitch
        phi_hat = atan(-a_x/a_z);

        // earth magnetic vector
        D = (2 + 31/60 + 48/3600 ) * (pi/180);

        // invert magnetometer input according to iphone axis
        m_y = -m_y;
        m_z = -m_z;
        
        // build formula for yaw (accelerometer + magnetometer)
        nom = cos(phi_hat)*m_y-sin(phi_hat)*m_z;
        denom = cos(theta_hat)*m_x+sin(phi_hat)*sin(theta_hat)*m_y+cos(phi_hat)*sin(theta_hat)*m_z;

        // estimated yaw
        psi_hat = psi_old + g_z * dt;

        // convert to degrees from radians
        roll = phi_hat*180/pi;
        pitch = theta_hat*180/pi;
        yaw = psi_hat;

        // round data to pass for the mouse movement script
        roll = round(roll);
        pitch = round(pitch);
        yaw = round(yaw);

        var _ret = {
            roll: roll,
            pitch: pitch,
            yaw: yaw,
            psi: psi_hat
        }
        
        return _ret
    },

    estimateAttitudeComplementary: function(a_x, a_y, a_z, m_x, m_y, m_z, g_x, g_y, g_z, theta_hat_g_old, phi_hat_g_old ,psi_hat_g_old, dt){
        /*
        Estimate attitude from accelerometer + magnetometer and gyrometer.
        */

        // earth magnetic vector
        var D = (2 + 31/60 + 48/3600 ) * (pi/180);

        // invert magnetometer input according to iphone axis
        var m_y = -m_y;
        var m_z = -m_z;

        /* pitch roll and yaw estimations */
        // estimated pitch from accelerometer
        var theta_hat_am = asin(-a_y*g/g);

        // estimated pitch from gyrometer (in radians)
        var theta_hat_g = theta_hat_g_old + g_x * dt;
        var theta_hat_g = theta_hat_g*180/25; //some calibration needed

        // estimated roll from accelerometer
        var phi_hat_am = atan(-a_x/a_z);

        // estimated roll from accelerometer (in radians)
        var phi_hat_g = phi_hat_g_old + g_y * dt;
        var phi_hat_g = phi_hat_g*180/25; //some calibration needed

        // build formula for yaw (accelerometer + magnetometer)
        var nom = cos(phi_hat_am)*m_y-sin(phi_hat_am)*m_z;
        var denom = cos(theta_hat_am)*m_x+sin(phi_hat_am)*sin(theta_hat_am)*m_y+cos(phi_hat_am)*sin(theta_hat_am)*m_z;
        // estimated yaw with accelerometer + magnetometer
        var psi_hat_am = D - atan(nom/denom);

        // estimated yaw with gyro (in radians)
        var psi_hat_g = psi_old + g_z * dt;
        var psi_hat_g = psi_hat_g*180/25; //some calibration needed

        // filters
        var damping_factor = 1.1; // 1 = no damping
        //calibration needed!
        var ki_theta = 1;
        var ki_phi = 1;
        var ki_psi = 1;

        var k_theta = 2*damping_factor*sqrt(ki_theta);
        var k_phi = 2*damping_factor*sqrt(ki_phi);
        var k_psi = 2*damping_factor*sqrt(ki_psi);

        // compute gyro offset
        //still have to figure this one out :) the offset isn't too bad
        //and we can easily reset the mouse position so
        //in the end this might not even be necessary

        // low pass filter for accel, high pass filter for gyro
        var theta_hat_amg = (k_theta/(dataFrequency + k_theta))*theta_hat_am + (dataFrequency/(dataFrequency + k_theta))*theta_hat_g;
        var phi_hat_amg = (k_phi/(dataFrequency + k_phi))*phi_hat_am + (dataFrequency/(dataFrequency + k_phi))*phi_hat_g;
        var psi_hat_amg = (k_psi/(dataFrequency + k_psi))*psi_hat_am + (dataFrequency/(dataFrequency + k_psi))*psi_hat_g;

        // convert to degrees from radians
        roll = phi_hat_amg*180/pi;
        pitch = theta_hat_amg*180/pi;
        yaw = psi_hat_amg;

        // round data to nearest to pass for the mouse movement script
        roll = round(roll);
        pitch = round(pitch);
        yaw = round(yaw);

        var _ret = {
            roll: roll,
            pitch: pitch,
            yaw: yaw,
            psi: psi_hat
        }
        
        return _ret
    },

    calculateDisplacement: function(roll, pitch, yaw){
        /*
        Maps the pitch and yaw into x,y coordinates for the mouse cursor, depending on screen size
        */
       
        // the values are inverted to match iPhone axis and screen space reflection
        var displacement_x = -yaw;
        var displacement_y = -pitch;

        // filter parameters

        // get screen size (TODO: prefferably dynamic ?)
        var screenx = 1980;
        var screeny = 1080;
        
        // max attitude angles
        var max_input_x = 60;
        var max_input_y = 40;

        // high pass filter to remove noise if needed
        var threshold_x = 10;
        var threshold_y = 10;

        // equations for the coversion
        var linear_slope_x = screenx/(2*max_input_x); //center x divided by max mapped value
        var linear_slope_y = screeny/(2*max_input_y); //center y divided by max mapped value
        var linear_translatino_x = screenx/2; //center x of the screen in pixels
        var linear_translation_y = screeny/2; //center y of the screen in pixels
        
        // if(abs(pitch) <= threshold_y) {
        //     displacement_y = 0;
        // }

        // if(abs(yaw) <= threshold_x) {
        //     displace ment_x = 0;
        // }

        // linear mapping
        displacement_x = linear_slope_x*displacement_x + linear_translatino_x;
        displacement_y = linear_slope_y*displacement_y + linear_translation_y;


        _ret = {
            d_x: displacement_x,
            d_y: displacement_y
        }

        return _ret;
    }
};