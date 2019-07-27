'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;
var url="mongodb://127.0.0.1:27017/curso";

var MongoClient = require('mongodb').MongoClient;


/*
MongoClient.connect(db, { useNewUrlParser: true })
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.log(err));
*/

MongoClient.connect(url,{ useNewUrlParser: true },function(err,db){
  if(err){
      console.log(err);
  }
  else {
      console.log('connected to '+ url);
      app.listen(port,function(){
            console.log("holii");
      });
      //db.close();
  }
})