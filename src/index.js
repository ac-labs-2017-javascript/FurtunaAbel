console.log("Hello world");

var express = require('express');
var app = express();
var fetch = require('node-fetch');
var cheerio =require('cheerio');
var url = 'http://www.dopopoco.ro/meniu-individual-timisoara';

function helloHanlder(req, res){
  var dopopocoResponse = fetch(url);
  var dopopocoText = dopopocoResponse.then(function (dopopocoHtml){
    return dopopocoHtml.text();
  });

function procesText(text) {
  var $ = cheerio.load(text);

  var listItem = Array.form($("#tiles").children("li"));
  return listItem.map(function (li) {
    return{
      title: $("li").find(".tiles").text()
    };
  });

}
  dopopocoText.then(function(theText){
    res.send(procesText(theText));
  });

}

app.get('/', helloHanlder);



app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
