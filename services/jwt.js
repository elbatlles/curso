'use strict'

var jtw = require("jwt-simple");
var moment = require("moment");
var secret = 'clave_secreta_2019';

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        imagen: user.imagen,
        iat: moment().unix(),
        exp: moment().add(30,'days').unix
    };

    return jtw.encode(payload,secret);
};
