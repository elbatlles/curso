'use strict'

var express = require('express');

var bodyParser = require('body-parser');

var app = express();


//cargar rutas
var user_routes= require('./routes/user');
var artist_routes= require('./routes/artist');
//cargar rutas

app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());

//rutas base
app.use('/api', user_routes);

app.use('/api', artist_routes);

//configurar cabeceras http
/*
app.get('/pruebas', function(req,res){
	res.status(200).send({message:'Bienvenido'});
});
*/
//rutas base

module.exports = app;