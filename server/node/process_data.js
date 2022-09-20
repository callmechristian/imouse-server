const {pi, matrix, abs, sin, cos, sqrt, pow, atan, asin, multiply, divide} = require('mathjs');
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

    estimateAttitude: function(a_x, a_y, a_z, m_x, m_y, m_z){
        let Math = require('mathjs')

        // phi = pi/3
        // theta = pi/3
        // psi = pi/4
        g = 9.81
        

        // C = [-sin(theta), sin(phi) * cos(theta), cos(phi)*cos(theta)] // Cn_b * e_3

        // a_b = multiply(-g, C)
        // a_x = a_b[0]
        // a_y = a_b[1]
        // a_z = a_b[2]


        theta_hat = asin(-a_y*g/g)

        phi_hat = atan(-a_x/a_z)

        D = (2 + 31/60 + 48/3600 )* (pi/180)

        m_x = m_x * Math.pow(10,-9)
        m_y = m_y * Math.pow(10,-9)
        m_z = -m_z * Math.pow(10,-9)
        nom = cos(phi_hat)*m_x-sin(phi_hat)*m_z
        denom = cos(theta_hat)*m_y+sin(phi_hat)*sin(theta_hat)*m_x+cos(phi_hat)*sin(theta_hat)*m_z


        psi_hat = D-atan(divide(nom,denom))

        roll = phi_hat*180/pi
        pitch = theta_hat*180/pi
        yaw = psi_hat*180/pi

        // roll = Math.round(roll * 100) / 100
        // pitch = Math.round(pitch * 100) / 100
        // yaw =Math.round(yaw * 100) / 100

        roll = Math.round(roll)
        pitch = Math.round(pitch)
        yaw =Math.round(yaw)
        
        var _ret = {
            roll: roll,
            pitch: pitch,
            yaw: yaw
        }
        
        return _ret
    },

    calculateDisplacement: function(roll, pitch, yaw){

    }
};