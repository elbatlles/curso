'use strict'

var fs = require('fs');
var path = require('path');
var mongosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');


function getAlbum(req,res){

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

module.exports = {
    getAlbum
}