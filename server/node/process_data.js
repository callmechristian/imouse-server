const {pi, abs, sin, cos, round, atan, asin} = require('mathjs');

function mapYaw(psi_hat) {
    psi_hat += 1600;
    psi_hat *= 360/3200;
    yaw = psi_hat - 180;

    return yaw;
}

module.exports = {   
    processAccellerationToVelocity: function(ax, ay, az, vx, vy, vz, dataFrequency) {

        velocity_x = vx + ax*dataFrequency;
        velocity_y = vy + ay*dataFrequency;
        velocity_z = vz + az*dataFrequency;

        var _ret = {
            vx: velocity_x,
            vy: velocity_y,
            vz: velocity_z
        }

        return _ret;
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
        let Math = require('mathjs')

        phi = pi/3
        theta = pi/3
        psi = pi/4
        g = 9.81
        

        C = [-sin(theta), sin(phi) * cos(theta), cos(phi)*cos(theta)] // Cn_b * e_3

        theta_hat = asin(-a_y*g/g);
        phi_hat = atan(-a_x/a_z);
        D = (2 + 31/60 + 48/3600 ) * (pi/180);

        m_y = -m_y;
        m_z = -m_z;
        

        nom = cos(phi_hat)*m_y-sin(phi_hat)*m_z;
        denom = cos(theta_hat)*m_x+sin(phi_hat)*sin(theta_hat)*m_y+cos(phi_hat)*sin(theta_hat)*m_z;

        psi_hat = psi_old + g_z * dt;

        roll = phi_hat*180/pi;
        pitch = theta_hat*180/pi;
        // yaw = psi_hat*180/pi
        yaw = mapYaw(psi_hat);

        roll = round(roll);
        pitch = round(pitch);
        yaw = round(yaw);
        yaw = psi_hat + 1600;
        yaw *= 800/3200;
        yaw = floor(yaw);

        var _ret = {
            roll: roll,
            pitch: pitch,
            yaw: yaw,
            psi: psi_hat
        }
        
        return _ret
    },

    calculateDisplacement: function(roll, pitch, yaw){
        var displacement_x = pitch;
        var displacement_y = yaw;
        var displacement_z = roll; //not necessary

        // filter parameters
        var screenx = 1980;
        var screeny = 1080;

        var max_input_x = 35;
        var max_input_y = 35;

        var threshold_x = 10;
        var threshold_y = 10;
        var linear_slope_x = screenx/(2*max_input_x); //center x divided by max mapped value
        var linear_slope_y = screeny/(2*max_input_y); //center y divided by max mapped value
        var linear_translatino_x = screenx/2; //center x of the screen in pixels
        var linear_translation_y = screeny/2; //center y of the screen in pixels
        
        if(abs(pitch) <= threshold_y) {
            displacement_y = 0;
        }

        if(abs(yaw) <= threshold_x) {
            displacement_x = 0;
        }

        displacement_x = linear_slope_x*displacement_x + linear_translatino_x;
        displacement_y = linear_slope_y*displacement_y + linear_translation_y;


        _ret = {
            d_x: displacement_x,
            d_y: displacement_y
        }

        return _ret;
    }
};