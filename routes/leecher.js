var request = require('request');
var cheerio = require('cheerio');
var async   = require('async');
var _       = require('underscore');
var db      = require(__base + 'db/db');

module.exports = function(url){
    return {
        url    :url,
        getList:function(){
            db.links(function(links){
                //this.getWeb('http://pimpmykeyboard.com/', 'ul.ProductList > li .ProductDetails > a');
                var arrFnS = [];

                //get all from links

                _.each(links, function(link){
                    arrFnS.push(function(callback){
                        callback(null, 'one');
                    });
                });

                async.parallel(arrFnS);
            });
        },
        getWeb :function(link, selector){
            request({
                method:'GET',
                url   :link
            }, function(err, response, body){
                if(err) return console.error(err);
                // Tell Cherrio to load the HTML
                $ = cheerio.load(body);
                $(selector).each(function(){
                    var html = $(this).html();
                    console.log(html);
                });
            });
        }
    };
};
