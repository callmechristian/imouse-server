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

        phi = Math.pi/3
        theta = Math.pi/3
        psi = Math.pi/4
        g = 9.81
        

        C = [-Math.sin(theta), Math.sin(phi) * Math.cos(theta), Math.cos(phi)*Math.cos(theta)] // Cn_b * e_3

        a_b = Math.multiply(-g, C)
        a_x = a_b[0]
        a_y = a_b[1]
        a_z = a_b[2]

        console.log(a_x)

        phi_hat = Math.asin(a_x/g)
        theta_hat = Math.atan(a_y/a_z)

        D = (2 + 31/60 + 48/3600 )* (Math.pi/180)
        I = (59 + 33/60 + 23/3600)* (Math.pi/180)
        m = Math.sqrt((23660*Math.pow(10,-9))^2+(821*Math.pow(10,-9))^2+(40209*Math.pow(10,-9))^2)

        m_n = Math.multiply([Math.cos(-I)*Math.cos(D), Math.cos(-I)*Math.sin(D),Math.sin(Math.abs(I))], m)


        Cn_b = Math.matrix([[Math.cos(theta)*Math.cos(psi),Math.cos(theta)*Math.sin(psi),-Math.sin(theta)],
            [Math.sin(phi)*Math.sin(theta)*Math.cos(psi)-Math.sin(psi)*Math.cos(phi), Math.sin(phi)*Math.sin(theta)*Math.sin(psi)+Math.cos(phi)*Math.cos(psi),  Math.sin(phi)*Math.cos(theta)],
            [Math.cos(phi)*Math.sin(theta)*Math.cos(psi)+Math.sin(phi)*Math.sin(psi), Math.cos(phi)*Math.sin(theta)*Math.sin(psi)-Math.sin(phi)*Math.cos(psi), Math.cos(phi)*Math.cos(theta)]])
        
        m_b = Math.multiply(Cn_b, m_n)

        m_x = m_b._data[0]
        m_y = m_b._data[1]
        m_z = m_b._data[2]

        nom = Math.cos(phi_hat)*m_y-Math.sin(phi_hat)*m_z
        denom = Math.cos(theta_hat)*m_x+Math.sin(phi_hat)*Math.sin(theta_hat)*m_y+Math.cos(phi_hat)*Math.sin(theta_hat)*m_z


        psi_hat = D-Math.atan(Math.divide(nom,denom))
        console.log(theta_hat)
        console.log(phi_hat)
        console.log(psi_hat)
    }
};