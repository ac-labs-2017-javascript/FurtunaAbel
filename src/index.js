var express = require('express');
var app= express();
var sqlite3 = require('sqlite3').verbose();

var db= new sqlite3.Database("./db");

app.get("/hello", function(req,res){
	db.all("SELECT * FROM pizza",function(err,results){
		if(err){
			throw err;
		}
		res.send(results);
	});
});

app.listen(3200, function(){
    console.log("running");
});
