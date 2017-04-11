
//console.log("Hello world");
var express = require('express');
var fetch = require('node-fetch');
var app = express();
var cheerio = require('cheerio');
var sqlite3= require('sqlite3').verbose();
var db = new sqlite3.Database('./db');

function processText(text){
	var $ = cheerio.load(text);
	var site = "www.dopopoco.ro";
    var listItems = Array.from($("#tiles").children("li"));
	return listItems.map(function(li){
		var prices = $(li).find(".pretVal");
		return {
			title: $(li).find(".title").text(),
			ingredients: $(li).find(".ingrediente").text().trim(),
			imagelink: site.concat($(li).find("img").attr("src")),
			smallpizzaprice: $(prices[0]).text(),
			bigpizzaprice: $(prices[1]).text(),
            pizzaplace: 'DopoPoco'
			//fullprice1: $(li).find(".pret").text().trim().substr(0,8),
			//fullprice2: $(li).find(".pret").text().substr(8,1000).trim().substr(8).trim()
		};
    });
}

function storeData(pizza){
db.serialize(function() {
  db.run("DROP TABLE pizza");
  db.run("CREATE TABLE pizza (title TEXT, ingredients TEXT, imagelink TEXT, smallpizzaprice TEXT, bigpizzaprice TEXT ,pizzaplace TEXT)");

  var stmt = db.prepare("INSERT INTO pizza(title,ingredients,imagelink,smallpizzaprice,bigpizzaprice,pizzaplace) VALUES (?,?,?,?,?,?)");

  for (var i = 0; i < pizza.length; i++) {
      var p = pizza[i];
      stmt.run(p.title,p.ingredients,p.imagelink, p.smallpizzaprice, p.bigpizzaprice,p.pizzaplace);
  }
  stmt.finalize();


	db.each("SELECT rowid AS id,title,ingredients,imagelink,smallpizzaprice,bigpizzaprice,pizzaplace FROM pizza", function(err, row) {
        if(err){
	  	  	throw err;
	  	  }
      console.log(row);
  }); 
});

}


app.get("/hello", function(req,res){

   	fetch("http://www.dopopoco.ro/meniu-individual-timisoara")
   		.then(function(response){
   			return response.text();
   		}).then(processText)
				.then(storeData)
				.then(function(data){
					res.send(data);
				});
});

app.listen(3200, function(){
    console.log("running");
})

