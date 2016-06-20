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
        leecher.allLinks(function(result){
            res.status(200).send({result:true, message:result})
        });
    });
    app.get(leecher.url + '/showLeechedData', function(req, res, next){
        var id = req.param('id');
        leecher.getLink(id, function(result){
            res.status(200).send({result:true, message:result});
        });
    });
    app.get(leecher.url + '/show', function(req, res, next){
        var id = req.param('id');
        leecher.showLink(id, function(result){
            res.status(200).send({result:true, message:result});
        });
    });
    app.post(leecher.url + '/saveLink', function(req, res, next){
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

        leecher.saveLink(inputs, function(newLink){
            //OK
            if(newLink){
                res.status(200).send({result:true, message:newLink});
                return true;
            }
            res.status(400).send({result:false, message:'Error'});
        });

    })
    app.post(leecher.url + '/remove', function(req, res, next){
        var inputs = req.body;
        leecher.removeLink(inputs.id, function(result){
            res.status(200).send({result:result});
        });
    })

    return app;
};
