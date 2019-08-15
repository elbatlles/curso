'use strict'

var fs = require('fs');
var path = require('path');
var mongosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req,res){

    var songId= req.params.id;
   
    Song.findById(songId).populate({path:'album'}).exec((err,song)=>{
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!song){
                res.status(404).send({message: 'El la canción no existe'});
        }else{
            res.status(200).send({song});
        }
        }
    });   
}


function saveSong(req,res){
    var song = new Song();

    var params = req.body;
    song.number = params.number;
    song.name= params.name;
    song.duration= params.duration;
    song.file='null';
    song.album= params.album;

    song.save((err,songStore)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(!songStore){
                res.status(404).send({message: 'No se a guardado la cancion'});
            }else{
                res.status(200).send({song:songStore});
            }
        }
    });
}

function getSongs(req,res){
    var albumId = req.params.id;

    if(!albumId){
        var find = Song.find({}).sort('number');

    }else{
        var find = Song.findById({Album: albumId}).sort('number');
    }
        find.populate({
            path: 'album',
            populate:{
                path:'artist',
                model: 'Artist'
            }
        }).exec(function(err,songs) {
            if(err){
                res.status(500).send({message: 'Error en el servidor'});
            }else{
                if(!songs){
                    res.status(404).send({message: 'No hay canciones'});
                }else{
                    res.status(200).send({songs});
                }
            }
        });

}

function updateSong(req,res){
    var SongId= req.params.id;
    var update = req.body;
    Song.findByIdAndUpdate(SongId,update, {new:true},(err,songupdated) =>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(!songupdated){
                res.status(404).send({message: 'No existe la canción'});
            }else{
                res.status(200).send({songupdated});
            }
        }

    });
}

function deleteSong(req,res){
    var SongId= req.params.id;
    Song.findByIdAndRemove(SongId, (err,songremoved) =>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(!songremoved){
                res.status(404).send({message: 'No se ha borrado la canción'});
            }else{
                res.status(200).send({songremoved});
            }
        }
    });
}


function uploadFile(req,res){
	var songId = req.params.id;
	var file_name = 'No subido';

	if(req.files){
        var file_path = req.files.image.path;
        console.log(file_path);
		var file_split = file_path.split('/');
		var file_name = file_split[2];
		console.log(file_name);
		//var ext_split = file_name.split('/');
		var ext_split = file_split[2].split('\.');
		var file_ext = ext_split[1];
		console.log(ext_split);

		if(file_ext =="mp3" || file_ext =="mp4" || file_ext =="ogg"){
			console.log("arxiu aceptat");
			Song.findByIdAndUpdate(songId,{file:file_name}, (err,songUpdated) => {
				if(err){
					res.status(500).send({message:"Error al actualizar la canción"});
							
				}else{
					console.log(songUpdated);
					if(!songUpdated){
						res.status(404).send({message:"No se a podido actualizar"});
							
					}else{
						console.log("todo correcto");
						res.status(200).send({Song:songUpdated});
							
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


function getSongFile(req,res){
	var songFile = req.params.songFile;
	var path_file= './uploads/songs/'+songFile;
	fs.exists('./uploads/songs/'+songFile, function(exists){
		if(exists){
			res.sendFile(path.resolve('./uploads/songs/'+songFile));
		}else{
			res.status(200).send({message:'No Existe el audio '});
		}
	})
}



module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
}