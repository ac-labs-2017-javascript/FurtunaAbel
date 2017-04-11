var scrapper = require("./scrapper");
var sqlite3 = require('sqlite3').verbose();

var endpoints =[{
	url: "http://www.dopopoco.ro/meniu-individual-timisoara",
	scrapeFunction : scrapper.dopopocoScrapper
}];

var db= new sqlite3.Database("./db");


function load(jsonData){
  return db.serialize(function() {
    var stmt = db.prepare("INSERT INTO pizza(title,ingredients,imagelink,smallpizzaprice,bigpizzaprice,pizzaplace) VALUES (?,?,?,?,?,?)");
    for (var i = 0; i < jsonData.length; i++) {
        var p = jsonData[i];
        stmt.run(p.title,p.ingredients,p.imagelink, p.smallpizzaprice, p.bigpizzaprice,p.pizzaplace);
    }
    stmt.finalize();
   
  });

}


function etl(endpoints){
	return Promise.all(scrapper.urlMapper(endpoints)).then(function(results){
		return Promise.all(results.map(load));
	});
}

db.serialize(function(){
  db.run("CREATE TABLE IF NOT EXISTS pizza (title TEXT, ingredients TEXT, imagelink TEXT, smallpizzaprice TEXT, bigpizzaprice TEXT ,pizzaplace TEXT)");
  etl(endpoints).then(null,function(error){
      console.error(error.stack);
  });
});