'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var  ArtistSchema = Schema({
	name: String,
	descripction: String,
	imagen:String
})

module.exports = mongoose.model('Artist',ArtistSchema); 

