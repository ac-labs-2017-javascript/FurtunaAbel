var fetch = require('node-fetch');
var cheerio = require('cheerio');

function scrapper(url, fn){
	return {
		scrape : function(){
			return fetch(url).then(function(response){
	   			return response.text();
	   		}).then(fn);
		}
	};
}

function dopopocoScrapper(text){
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

function urlMapper(endpoints){
	return endpoints.map(function(endpoint){
		return scrapper(endpoint.url,endpoint.scrapeFunction).scrape();
	});
}

module.exports = {
	urlMapper: urlMapper,
	dopopocoScrapper : dopopocoScrapper
};