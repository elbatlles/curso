'use strict'

var brcypt = require("bcrypt-nodejs");
var User = require("../models/user");


function pruebas(req,res){
	res.status(200).send({
		message:'Prboandouna acción del controlador de usuarios del api de rest con node y mongo'
	});
}

function saveUser(req,res){
	var user = new User("hola","hola","hola","hola","hola","hola");

	
	var params = req.body;
	console.log(params);
	user.name= params.name;
	user.surname= params.surname;
	user.email= params.email;
	user.role='ROLE_ADMIN';
	user.imagen='null';

	user.save(function (err, userdins) {
		if (err) return console.error(err);
		console.log("estem a dinsss???");
		console.log(userdins);
	  });

	if(false){
		console.log("enrem 1");
		brcypt.hash(params.password,null,null, function(err,hash){
			user.password= hash;
			console.log(user);
			if(user.name!=null && user.surname !=null && user.email !=null){
				//guaradr usuario
				console.log("anem a guardar el usuari");
			//	user.save();
				console.log("avee");
				
			/*	user.save((err,userStored) => {
					console.log("ss");
					if(err){
						console.log(err);
						res.status(500).send({message:"Error al guardar el usuario"});
			 	
					}else{
						console.log("33");
						if(!userStored){
							console.log("22");
							res.status(404).send({message:"Uusuario no registrado"});
			 	
						}else{
							console.log("44");
							res.status(200).send({user:userStored});
						}

					}
					console.log("final del save");
				}); */

				user.save(function (err, userdins) {
					if (err) return console.error(err);
					console.log(userdins);
				  });
				
			}else{
				res.status(200).send({message:"Introduce los datos correctamente"});
			}	
		});
		//encript password y guardar
	}else{
		// 
		res.status(200).send({message:"introduce la passwd"});
	}
	//console.log(userStored);
}

module.exports = {

pruebas,
saveUser

};