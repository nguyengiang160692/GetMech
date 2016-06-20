var request = require('request');
var cheerio = require('cheerio');
var async   = require('async');
var _       = require('underscore');
var db      = require(__base + 'db/db');
function checkURL(url){
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}
module.exports = function(url){
    return {
        url             :url,
        getLink         :function(_id, callback){
            var that = this;
            db.link.get(_id, function(link){
                link = link.toJSON();
                switch(link.fn.fnType){
                    case 'customHeader':
                        var headers = _.object(_.pluck(link.fn.fnParams, 'name'), _.pluck(link.fn.fnParams, 'value'));
                        that.readDataFromLink(link.url, link.selectors, {
                            headers:headers
                        }, function(arrHtml){
                            link.content = arrHtml;
                            callback && callback(link);
                        });
                        break;
                    default:
                        that.readDataFromLink(link.url, link.selectors, {}, function(arrHtml){
                            link.content = arrHtml;
                            callback && callback(link);
                        });
                        break;
                }
            });

        },
        allLinks        :function(cb){
            db.link.all(function(links){
                var arrFnS = [];
                _.each(links, function(link){
                    link = link.toJSON();
                    arrFnS.push(link);
                });
                cb && cb(arrFnS);
            });
        },
        showLink        :function(_id, cb){
            db.link.get(_id, function(result){
                cb && cb(result);
            });
        },
        readDataFromLink:function(link, selectors, ext_options, cb){
            var options = _.extend({
                method:'GET',
                url   :link
            }, ext_options);
            request(options, function(err, response, body){
                if(err) return console.error(err);
                var arrResults = [];

                if(response.headers['content-type'].toLowerCase() == 'application/json; charset=utf-8'){
                    var obj = JSON.parse(body);
                    _.each(selectors, function(selec){
                        //for example .data.featuredPosts|username
                        var selectorField = selec.value.split('|');
                        _.each(eval("obj" + selectorField[0]), function(selFie){
                            var shtml = '';
                            for(var x = 1 ; x < selectorField.length ; x++){
                                var fieldValue = selFie[selectorField[x]];
                                if(checkURL(fieldValue)){
                                    shtml += '<img style="max-width: 150px;" src="' + fieldValue + '">';
                                }else{
                                    shtml += '<p>' + fieldValue + '</p>';
                                }

                            }
                            arrResults.push({
                                label:selec.label,
                                html :shtml
                            });
                        });
                    });

                    cb && cb(arrResults);
                    return true;
                }
                if(response.headers['content-type'].toLowerCase() == 'text/html; charset=utf-8'){
                    $ = cheerio.load(body);
                    _.each(selectors, function(selec){
                        $(selec.value).each(function(){
                            //content inside
                            var html = $.html($(this));
                            arrResults.push({
                                label:selec.label,
                                html :html,
                                id   :$(this).attr('id'),
                                class:$(this).attr('class')
                            });

                        });
                    });
                    cb && cb(arrResults);
                    return true;
                }
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
