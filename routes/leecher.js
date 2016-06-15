var request = require('request');
var cheerio = require('cheerio');
var async   = require('async');
var _       = require('underscore');
var db      = require(__base + 'db/db');

function combineUrlQuery(url, paramters){
    if(_.isArray(paramters)){
        var combined = '';
        _.each(paramters, function(par){
            combined += '&' + par.name + '=' + par.value;
        });
        return url + combined;
    }
}

module.exports = function(url){
    return {
        url             :url,
        allLinks        :function(cb){
            var that = this;
            db.link.all(function(links){
                var arrFnS = [];
                _.each(links, function(link){
                    link = link.toJSON();
                    switch(link.fn.fnType){
                        case 'searchQuery':
                            arrFnS.push(function(callback){
                                that.readDataFromLink(combineUrlQuery(link.url, link.fn.fnParams), link.selectors, function(arrHtml){
                                    link.content = arrHtml;
                                    callback(null, link);
                                });
                            });
                            break;
                    }

                });
                async.parallel(arrFnS, function(err, results){
                    cb && cb(results);
                });
            });
        },
        showLink        :function(_id, cb){
            db.link.get(_id, function(result){
                cb && cb(result);
            });
        },
        readDataFromLink:function(link, selectors, cb){
            request({
                method:'GET',
                url   :link
            }, function(err, response, body){
                if(err) return console.error(err);

                // Tell Cherrio to load the HTML
                $ = cheerio.load(body);

                var arrResults = [];

                _.each(selectors, function(selec){
                    $(selec.value).each(function(){
                        var html = $(this).html();
                        arrResults.push({
                            label:selec.label,
                            value:html
                        });
                    });
                });

                cb && cb(arrResults);
            });
        },
        saveLink        :function(inputs, cb){
            var waterfall = [];

            if(!_.isUndefined(inputs.linkID)){
                db.link.findById(inputs.linkID, function(err, found){
                    if(!found){
                        //add
                        var link = new db.link(inputs);
                        waterfall.push(function(callback){
                            callback(null, link);
                        });
                    }else{
                        //edit
                        waterfall.push(function(callback){
                            db.link.findByIdAndUpdate(inputs.linkID, {$set:inputs}, function(err, link){
                                if(err) return false;
                                callback(null, link);
                            });
                        });
                    }

                    if(waterfall){
                        async.waterfall(waterfall, function(err, link){
                            link.save(function(err, res){
                                if(err) cb && cb(false);
                                cb && cb(res);
                            });
                        });
                    }
                });
            }
        },
        removeLink      :function(id, cb){
            db.link.findByIdAndRemove(id, function(err){
                if(err) cb && cb(false);
                cb && cb(true);
            })
        }
    };
};
