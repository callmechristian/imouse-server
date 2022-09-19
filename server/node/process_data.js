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

    estimateAttitude: function(){
        let Math = require('mathjs')

        phi = pi/3
        theta = pi/3
        psi = pi/4
        g = 9.81
        

        C = [-sin(theta), sin(phi) * cos(theta), cos(phi)*cos(theta)] // Cn_b * e_3

        a_b = multiply(-g, C)
        a_x = a_b[0]
        a_y = a_b[1]
        a_z = a_b[2]

        console.log(a_x)

        phi_hat = asin(a_x/g)
        theta_hat = atan(a_y/a_z)

        D = (2 + 31/60 + 48/3600 )* (pi/180)
        I = (59 + 33/60 + 23/3600)* (pi/180)
        m = sqrt((23660*pow(10,-9))^2+(821*pow(10,-9))^2+(40209*pow(10,-9))^2)

        m_n = multiply([cos(-I)*cos(D), cos(-I)*sin(D),sin(abs(I))], m)


        Cn_b = matrix([[cos(theta)*cos(psi),cos(theta)*sin(psi),-sin(theta)],
            [sin(phi)*sin(theta)*cos(psi)-sin(psi)*cos(phi), sin(phi)*sin(theta)*sin(psi)+cos(phi)*cos(psi),  sin(phi)*cos(theta)],
            [cos(phi)*sin(theta)*cos(psi)+sin(phi)*sin(psi), cos(phi)*sin(theta)*sin(psi)-sin(phi)*cos(psi), cos(phi)*cos(theta)]])
        
        m_b = multiply(Cn_b, m_n)

        m_x = m_b._data[0]
        m_y = m_b._data[1]
        m_z = m_b._data[2]

        nom = cos(phi_hat)*m_y-sin(phi_hat)*m_z
        denom = cos(theta_hat)*m_x+sin(phi_hat)*sin(theta_hat)*m_y+cos(phi_hat)*sin(theta_hat)*m_z


        psi_hat = D-atan(divide(nom,denom))
        console.log(theta_hat)
        console.log(phi_hat)
        console.log(psi_hat)
    }
};