var express = require("express");
var fetch = require("node-fetch"); //call catre url, primim datele 

var cheerio = require("cheerio");
var app = express();


// http://www.dopopoco.ro/meniu-individual-timisoara

function processText(){
  var $ = cheerio.load(text);

  var listItems = Array.from($("#tiles").children("li"));
  return listItems.map(function(li){
  	return{
  		title: $(li).find(".title").text()
  	};
  });
}


app.get("/hello",function(req,res){
	//res.send("Bye world");
	var dopopocoSite = fetch("http://www.dopopoco.ro/meniu-individual-timisoara"); //returneaza un obj
	var textResponse = dopopocoSite.then(function(response){
// response -> contentul url-ului
      return response.text();
	});
	textResponse.then(function(text){
		res.send(processText(text)); //res ajunge la browser
	});
});

app.listen(8090,function(){
	console.log("Server running on 8090");
});