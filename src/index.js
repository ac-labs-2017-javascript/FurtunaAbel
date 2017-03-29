//console.log("Hello world");
var express = require('express');
var fetch = require('node-fetch');
var app = express();
var cheerio = require('cheerio'); 

function processText(text){
	var $ = cheerio.load(text);
    var listItems = Array.from($("#tiles").children("li"));
	return listItems.map(function(li){
		return {
			title: $(li).find(".title").text()
		};
    });
}

app.get("/hello", function(req,res){

   	fetch("http://www.dopopoco.ro/meniu-individual-timisoara")
   		.then(function(response){
   			return response.text();
   		}).then(function(text){
   			res.send(processText(text));
   		});
});

app.listen(3200, function(){
    console.log("running");
})