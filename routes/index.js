var express = require('express');
var _       = require('underscore');
var leecher = require(__base + 'routes/leecher')('/leecher');

module.exports = function(app){
    /* GET home page. */
    app.get('/', function(req, res, next){
        res.render('index', {title:'Express'});
    });

    //leecher
    app.get(leecher.url, function(req, res, next){
        leecher.allLinks();
    });

    app.post(leecher.url + '/addLink', function(req, res, next){

        var inputs = req.body;
        if(_.isEmpty(inputs.fn.fnType)){
            res.status(400).send({result:false});
        }

        switch(inputs.fn.fnType){
            case 'searchQuery':

                break;
            case "0":

                break;
        }

        leecher.addLink(inputs, function(newLink){
            //OK
            if(newLink){
                res.status(200).send({result:true, message:newLink});
                return true;
            }
            res.status(400).send({result:false});
        });

    })
    return app;
};
