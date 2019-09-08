'use strict'

var fs = require('fs');
var path = require('path');
var mongosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req,res){

    var artistid= req.params.id;

    Artist.findById(artistid,(err,artist) =>{
        if(err){
            res.status(200).send({message: 'Error en la peticion'});
        }else{
            if(!artist){
                res.status(404).send({message: 'El artista no existe'});
            }else{
                res.status(200).send({artist});
            }
        }
    });
   // res.status(200).send({message: 'Metodo getArtist del controlador artist.js'});
}

function getArtists(req,res){

    if(req.params.page){
        var page= req.params.page;
    }else{
        var page= 1;
    }
   // var page = req.params.page;
    var itemsPerPage =4;

   
    Artist.find().sort('name').paginate(page,itemsPerPage, function(err,artists,total){
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!artists){
                res.status(500).send({message: 'No hay artistas!!'});
            }else{
                console.log("entrem a llistar?");
                res.status(200).send({total_items: total,
                artists:artists});
            }
        }
    });


}

function saveArtist(req,res){
    var artist = new Artist();

    var params = req.body;

    artist.name= params.name;
    artist.description = params.description;
    artist.image = 'null';
    artist.save((err,artistStored) =>{
        if(err){
            res.status(500).send({message:'Error al guardar el artista'});
        }else{
            if(!artistStored){
                res.status(404).send({message:'EL arttista no sido guardado'});
            }else{
                res.status(200).send({artist:artistStored});
            }
        }
    })
}

function updateArtist(req,res){
    var artistId = req.params.id;
    var update = req.body;
console.log("entrem?");
console.log(artistId);
console.log(update);
    Artist.findByIdAndUpdate(artistId,update,{new:true},(err,artistupdated)=>{
        if(err){
            res.status(500).send({message:'Error al guardar el artista'});
        }else{
            if(!artistupdated){
                res.status(404).send({message:'El artista no a sido actualizado'});
            }else{
                console.log("pujem adal");
                res.status(200).send({
                    artist: artistupdated,
                   
                });
            }
        }
    })
}

function deleteArtist(req,res){
    var artistId = req.params.id;

    Artist.findByIdAndRemove(artistId,(err,artistremoved) =>{
        if(err){
            res.status(500).send({message:'Error al eliminar el artista'});
        }else{
            if(!artistremoved){
                res.status(404).send({message:'El artista no a sido elimnado'});

            }else{
                console.log({artistremoved});
                Album.find({artist: artistremoved._id}).remove((err,albumremoved)=>{
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
                                 //   res.status(200).send({message:'Artista eliminado'});
                                 res.status(200).send({ artist: artistremoved});
                                }
                            }
        
                        });
                           //SONG
                        }
                    }

                });
            }
        }
    });
}

function uploadImage(req,res){
	var artistId = req.params.id;
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
			Artist.findByIdAndUpdate(artistId,{image:file_name}, (err,artistUpdated) => {
				if(err){
					res.status(500).send({message:"Error al actualizar el usuario"});
							
				}else{
					console.log(artistUpdated);
					if(!artistUpdated){
						res.status(404).send({message:"El usuario no se podido actualizar"});
							
					}else{
						console.log("todo correcto");
						res.status(200).send({Artist:artistUpdated});
							
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
	var path_file= './uploads/artists/'+imageFile;
	fs.exists('./uploads/artists/'+imageFile, function(exists){
		if(exists){
			res.sendFile(path.resolve('./uploads/artists/'+imageFile));
		}else{
			res.status(200).send({message:'No Existe la imagen '});
		}
	})
}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};

