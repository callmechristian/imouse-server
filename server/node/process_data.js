const {pi, matrix, abs, sin, cos, sqrt, pow, atan, asin, multiply, divide} = require('mathjs');
var log = require('./logging');
const fs = require("fs");

function mapYaw(psi_hat) {
    

    psi_hat += 1600

    psi_hat *= 360/3200
    
    yaw = psi_hat-180

    return yaw
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

    // estimateAttitude: function(a_y, a_x, a_z, m_y, m_x, m_z, g_x, g_y, g_z, dataFrequency, psi_hat){
    //     let Math = require('mathjs')

    //     //normalize accelleration
    //     g = 9.81;
    //     a_x = a_x*g;
    //     a_y = a_y*g;
    //     a_z = a_z*g;

    //     theta_hat = asin(a_x/g);
    //     phi_hat = atan(a_y/a_z);

    //     D = (2 + 31/60 + 48/3600 ) * (pi/180);

    //     TtonT = pow(10,-9); //tesla to nanotesla
    //     m_x = m_x*TtonT;
    //     m_y = m_y*TtonT;
    //     m_z = m_z*TtonT;

    //     // nom = (cos(phi_hat)*m_y)-(sin(phi_hat)*m_z);
    //     // denom = (cos(theta_hat)*m_x)+(sin(phi_hat)*sin(theta_hat)*m_y)+(cos(phi_hat)*sin(theta_hat)*m_z);


    //     // psi_hat = D-atan(nom/denom)
    //     // console.log(theta_hat)
    //     // console.log(phi_hat)
    //     // console.log(psi_hat)
    //     // console.log("ax:" + a_x + "\n")
    //     // console.log("m_x:" + m_x + ", m_y:" + m_y + ", m_z:" + m_z + "\n");

    //     psi_hat = psi_hat + g_z*dataFrequency;
    //     // console.log(g_z);

    //     roll = phi_hat*180/pi;
    //     pitch = theta_hat*180/pi;
    //     yaw = psi_hat;

    //     // var _raw = {
    //     //     a_x: a_x,
    //     //     a_y: a_y,
    //     //     a_z: a_z,
    //     //     m_x: m_x,
    //     //     m_y: m_y,
    //     //     m_z: m_z
    //     // }
    //     // fs.appendFile("../../logs/log_accel_magn_raw_1.json", JSON.stringify(_raw) + ",\n", (err) => {
    //     //     if (err) {
    //     //       console.log(err);
    //     //     }
    //     //     else {
    //     //       // Get the file contents after the append operation
    //     //       console.log("\nLogged:" + JSON.stringify(_raw));
    //     //    }
    //     // });

    //     var _ret = {
    //         roll: roll,
    //         pitch: pitch,
    //         yaw: yaw,
    //         psi_hat: psi_hat
    //     }
        
    //     return _ret
    // },
    estimateAttitude: function(a_x, a_y, a_z, m_x, m_y, m_z, g_x, g_y, g_z, psi_old, dt){
        let Math = require('mathjs')

        phi = Math.pi/3
        theta = Math.pi/3
        psi = Math.pi/4
        g = 9.81
        

        C = [-Math.sin(theta), Math.sin(phi) * Math.cos(theta), Math.cos(phi)*Math.cos(theta)] // Cn_b * e_3

        // a_b = multiply(-g, C)
        // a_x = a_b[0]
        // a_y = a_b[1]
        // a_z = a_b[2]


        theta_hat = asin(-a_y*g/g)

        phi_hat = atan(-a_x/a_z)

        D = (2 + 31/60 + 48/3600 )* (pi/180)

        m_y = -m_y
        m_z = -m_z
        

        nom = cos(phi_hat)*m_y-sin(phi_hat)*m_z
        denom = cos(theta_hat)*m_x+sin(phi_hat)*sin(theta_hat)*m_y+cos(phi_hat)*sin(theta_hat)*m_z

        

        // psi_hat = D-atan(divide(nom,denom))

        psi_hat = psi_old + g_z * dt;
        // console.log(psi_hat);
        // console.log(g_z)
        if (psi_hat < -1599)
        {
            psi_hat = -1599
        }
        if (psi_hat > 1600)
        {
            psi_hat = 1600
        }
        

        roll = phi_hat*180/pi
        pitch = theta_hat*180/pi
        // yaw = psi_hat*180/pi
        yaw = mapYaw(psi_hat)

        // if (abs(yaw) > 180){
        //     psi_hat = 0
        //     yaw = 0
        // }

        // roll = Math.round(roll * 100) / 100
        // pitch = Math.round(pitch * 100) / 100
        // yaw =Math.round(yaw * 100) / 100

        roll = Math.round(roll)
        pitch = Math.round(pitch)
        yaw = Math.round(yaw)
        yaw = psi_hat + 1600
        yaw *= 800/3200
        yaw = Math.floor(yaw)

        // console.log(yaw);

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
        var threshold_x = 10;
        var threshold_y = 10;
        var linear_slope_x = 1/2;
        var linear_slope_y = 1/2;
        
        if(abs(pitch) <= threshold_y) {
            displacement_y = 0;
        }

        if(abs(yaw) <= threshold_x) {
            displacement_x = 0;
        }

        displacement_x = linear_slope_x*displacement_x;
        displacement_y = linear_slope_y*displacement_y;


        _ret = {
            d_x: displacement_x,
            d_y: displacement_y
        }

        return _ret;
    }
};