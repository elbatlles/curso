'use strict'

var fs = require('fs');
var path = require('path');
var mongosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');


function getAlbum(req,res){

    var albumid= req.params.id;

    Album.findById(albumid).populate({path:'artist'}).exec((err,album)=>{
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!album){
                res.status(404).send({message: 'El album no existe'});
        }else{
            res.status(200).send({album});
        }
        }
    });    

  /*  Album.findById(albumid,(err,album) =>{
        if(err){
            res.status(200).send({message: 'Error en la peticion'});
        }else{
            if(!album){
                res.status(404).send({message: 'El album no existe'});
            }else{
                res.status(200).send({album});
            }
        }
    });*/
   // res.status(200).send({message: 'Metodo getArtist del controlador artist.js'});
}

function saveAlbum(req,res){
     var album = new Album();

     var params = req.body;
     album.title= params.title;
     album.description= params.description;
     album.year= params.year;
     album.image= 'null';
     album.artist= params.artist;

     album.save((err,albumStore)=>{
         if(err){
            res.status(500).send({message: 'Error en la peticion'});
         }else{
             if(!albumStore){
                res.status(404).send({message: 'No se a guardado'});
             }else{
                res.status(200).send({albumStore});
             }
         }
     });
}

function getAlbums(req,res){
    var artistId = req.params.artist;
    if(!artistId){
        var find= Album.find().sort('title');
    }else{
        var find = Album.find({artist: artistId}).sort('year');
    }
    find.populate({path:'artist'}).exec((err,albums)=>{
        if(err){
            res.status(500).send({message:'Error en la peticion'});
         }else{
             if(!albums){
                res.status(500).send({message:'No hay albums'});
                 
             }else{
                res.status(200).send({albums});
        
             }
         }
         });

}

function updateAlbum(req,res){
    var albumId = req.params.id;
    var update =req.body;

    Album.findByIdAndUpdate(albumId,update,{new:true},(err,albumupdate)=> { 
        if(err){
            res.status(500).send({message:'Error en la peticion'});
         }else{
             if(!albumupdate){
                res.status(404).send({message:'No hay albums'});
                 
             }else{
                res.status(200).send({albumupdate});
        
             }
        }
    });
}

function deleteAlbum(req,res){
    var albumId = req.params.id;
    Album.findByIdAndRemove(albumId,(err,albumremoved)=>{
        if(err){
            res.status(500).send({message:'Error eliminar el album'});
        }else{
            if(!albumremoved){
                res.status(404).send({message:'El album no a sido elimnado'});

            }else{
               //SONG
               Song.find({album: albumremoved._id}).remove((err,songremoved)=>{
                if(err){
                    res.status(500).send({message:'Error eliminar la cancion'});
                }else{
                    if(!songremoved){
                        res.status(404).send({message:'La cancion no a sido eliminada'});
        
                    }else{
                        res.status(200).send({albumremoved});
                    }
                }

            });
               //SONG
            }
        }

    });
}

function uploadImage(req,res){
	var albumid = req.params.id;
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
			Album.findByIdAndUpdate(albumid,{image:file_name}, (err,albumUpdated) => {
				if(err){
					res.status(500).send({message:"Error al actualizar el usuario"});
							
				}else{
					console.log(albumUpdated);
					if(!albumUpdated){
						res.status(404).send({message:"El usuario no se podido actualizar"});
							
					}else{
						console.log("todo correcto");
						res.status(200).send({Album:albumUpdated});
							
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
	var path_file= './uploads/albums/'+imageFile;
	fs.exists('./uploads/albums/'+imageFile, function(exists){
		if(exists){
			res.sendFile(path.resolve('./uploads/albums/'+imageFile));
		}else{
			res.status(200).send({message:'No Existe la imagen '});
		}
	})
}


module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}