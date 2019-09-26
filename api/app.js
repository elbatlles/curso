'use strict'

var express = require('express');

var bodyParser = require('body-parser');

var app = express();


//cargar rutas
var user_routes= require('./routes/user');
var artist_routes= require('./routes/artist');

var album_routes= require('./routes/album');

var song_routes= require('./routes/song');
//cargar rutas

app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
})
//rutas base
app.use('/api', user_routes);

app.use('/api', artist_routes);

app.use('/api', album_routes);

app.use('/api', song_routes);

//configurar cabeceras http
/*
app.get('/pruebas', function(req,res){
	res.status(200).send({message:'Bienvenido'});
});
*/
//rutas base

module.exports = app;