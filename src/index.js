//console.log("Hello world");
var express = require('express');
var fetch = require('node-fetch');
var app = express();
var cheerio = require('cheerio');
var sqlite3= require('sqlite3').verbose();
var db = new sqlite3.Database('abcd');

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
			//fullprice1: $(li).find(".pret").text().trim().substr(0,8),
			//fullprice2: $(li).find(".pret").text().substr(8,1000).trim().substr(8).trim()
		};
    });
}

function storeData(pizza){
db.serialize(function() {
  db.run("CREATE TABLE pizzas (id NUMBER, pizzaname TEXT, ingredients TEXT, imagelink TEXT, smallpizzaprice TEXT, bigpizzaprice TEXT ,pizzaplace TEXT");

  var stmt = db.prepare("INSERT INTO pizzas( pizzaname TEXT, ingredients TEXT, imagelink TEXT, smallpizzaprice TEXT, bigpizzaprice TEXT VALUES (?,?,?,?,?,?))");

  for (var i = 0; i < pizza.length; i++) {
      stmt.run(pizza[i].title,pizza[i].ingredients,pizza[i].imagelink, pizza[i].smallpizzaprice, pizza[i].bigpizzaprice,'dopopoco');
  }
  stmt.finalize();

});
	db.each("SELECT rowid AS id, inf FROM pizzas", function(err, row) {
      console.log(row.id + ": " + row.info);
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
