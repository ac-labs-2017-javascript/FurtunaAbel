


var express = require('express');
var app = express();
var fetch = require('node-fetch');
var cheerio = require('cheerio');
var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database(':memory:');

function DB(pizzas){
  db.serialize(function(){
  db.run("CREATE TABLE pizza ( pizza TEXT, ingrediente TEXT, link TEXT, pizzaPlace TEXT, samllPrice TEXT, bigPrice TEXT) ");

  var stmt= db.prepare("INSERT INTO pizza(pizza, ingrediente, link, pizza Place, smallPrice, bigPrice) VALUES(?,?,?,?,?,?)");

  for(var i = 0; i<pizzas.length; i++){
      var p = pizzas[i];
        stmt.run(p.title[i], p.ingrediente[i], p.link[i], p.pizzaPlace[i],p.smallPrice[i], p.bigPrice[i]);
  }
  stmt.finalize();

  db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
      console.log(row.id + ": " + row.info);
  });
});}


function procesText(text) {
  var $ = cheerio.load(text);

  var listItem = Array.from($("#tiles").children("li"));
  return listItem.map(function (li) {
    return{
      title: $(li).find(".title").text(),
      ingrediente:$(li).find(".ingrediente").text().trim(),
      link:$(li).find("img").attr("src"),
      pizzaPlace:"Dopopoco",
      smallPrice:$(li).find(".pret").find("div:nth-child(1)").find(".pretVal").text(),
      bigPrice:$(li).find(".pret").find("div:nth-child(2)").find(".pretVal").text()
    };


  });

}

var url = 'http://www.dopopoco.ro/meniu-individual-timisoara';

function helloHanlder(req, res){
  var dopopocoResponse = fetch(url);
  var dopopocoText = dopopocoResponse.then(function (dopopocoHtml){
    return dopopocoHtml.text();
  });
  dopopocoText.then(function(theText){
    var result = procesText(theText)
    DB(result);
    res.send();
  });

}

app.get('/', helloHanlder);



app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
