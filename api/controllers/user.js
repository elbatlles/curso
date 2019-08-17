'use strict'

var fs = require('fs');
var path = require('path');

var mongoose = require('mongoose');
var brcypt = require("bcrypt-nodejs");
var User = require("../models/user");

var jtw = require("../services/jwt");



mongoose.connect('mongodb://localhost/curso', {
	useNewUrlParser: true,
	useFindAndModify: false
});

function pruebas(req,res){
	res.status(200).send({
		message:'Probando acción del controlador de usuarios del api de rest con node y mongo'
	});
}

function saveUser(req,res){
	   
var user = new User();

	
var params = req.body;
console.log(params);
	console.log(params);
	user.name= params.name;
	user.surname= params.surname;
	user.email= params.email;
	user.password= params.password;
	user.role=params.role;
	user.imagen='null';

	 

	if(user.password!=null){
		 
		brcypt.hash(params.password,null,null, function(err,hash){
			user.password= hash;
			console.log(user);
			if(user.name!=null && user.surname !=null && user.email !=null){
				//guaradr usuario
				
			//	user.save();
			
				
			user.save((err,userStored) => {
					
					if(err){
						console.log(err);
						res.status(500).send({message:"Error al guardar el usuario"});
			 	
					}else{
						
						if(!userStored){
							
							res.status(404).send({message:"Uusuario no registrado"});
			 	
						}else{
							
							res.status(200).send({user:userStored});
						}

					}
					console.log("final del save");
				});

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


function loginUser(req,res){
	var  params = req.body;

	var email = params.email;
	var password = params.password;


	//User.findOne({email:email.toLowerCase()}, (err,user) => {
		User.findOne({email:email}, (err,user) => {
	
		 	if(err){
				res.status(500).send({message:"no encontrado"});
			}else{
				if(!user){
					res.status(500).send({message:"El usuari no existe"});
				}else{
					//comprobar paswd
					brcypt.compare(password,user.password, function(err,check){
						console.log(password);
						console.log(user.password);
						if(check){
							
								if(params.gethash){

									// devolver un token de jtw
									res.status(200).send({
										token: jtw.createToken(user)
									})
								}else{
									res.status(200).send({user});
								}
							//Devolver datos usuario
						}else{
							res.status(404).send({message:"El usuari  no ha podido loguearse"});
						}
					});
				}  
			}
	});
	
}
	
function updateUser(req,res){
	var userId = req.params.id;
	console.log(userId);
	var update = req.body;
	console.log(update);
	//var err;
	User.findByIdAndUpdate(userId,update,{new:true},(err,userUpdated) => {
		if(err){
			res.status(500).send({message:"Error al actualizar el usuario"});
					
		}else{
			console.log(userUpdated);
			if(!userUpdated){
				res.status(404).send({message:"El usuario no se podido actualizar"});
					
			}else{
				res.status(200).send({user:userUpdated});
					
			}
		
		}
	});

}

function uploadImage(req,res){
	var userId = req.params.id;
	var file_name = 'No subido';

	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('/');
		var file_name = file_split[2];
		console.log(file_name);
		//var ext_split = file_name.split('/');
		var ext_split = file_split[2].split('\.');
		var file_ext = ext_split[1];
		console.log(ext_split);

		if(file_ext =="png" || file_ext =="gif" || file_ext =="jpg"){
			console.log("arxiu aceptat");
			User.findByIdAndUpdate(userId,{image:file_name}, (err,userUpdated) => {
				if(err){
					res.status(500).send({message:"Error al actualizar el usuario"});
							
				}else{
					console.log(userUpdated);
					if(!userUpdated){
						res.status(404).send({message:"El usuario no se podido actualizar"});
							
					}else{
						console.log("todo correcto");
						res.status(200).send({image:file_name,user:userUpdated});
							
					}
				
				}
			});
		}else{
			res.status(200).send({message:'Extension del archivo no valida'});
		
		}

	}else  {
		res.status(200).send({message:'No has subido ninguna imagen...'});
	}
}


function getImageFile(req,res){
	var imageFile = req.params.imageFile;
	var path_file= './uploads/users/'+imageFile;
	fs.exists('./uploads/users/'+imageFile, function(exists){
		if(exists){
			res.sendFile(path.resolve('./uploads/users/'+imageFile));
		}else{
			res.status(200).send({message:'No Existe la imagen '});
		}
	})
}

module.exports = {
getImageFile,
pruebas,
saveUser,
loginUser,
updateUser,
uploadImage

};