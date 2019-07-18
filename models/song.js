'use strict'

var moongose = require('mongoose');

var Schema = mongoose.Schema;

var  SongSchema = Schema({
	number:Number,
	name:String,
	duration:String,
	album:{type:Schema.objectID,ref:'Album'}
	});

module.exports = mongoose.model('Song',SongSchema); 

