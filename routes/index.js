var express = require('express');
var leecher = require(__base + 'routes/leecher')('/leecher');

module.exports = function(app){
    /* GET home page. */
    app.get('/', function(req, res, next){
        res.render('index', {title:'Express'});
    });

    //leecher
    app.get(leecher.url, function(req, res, next){
        leecher.getList();
    });
    app.post(leecher.url + '/addLink', function(req, res, next){

        var body = req.body;



        res.status(400).send({test:"1234"});
    })
    return app;
};
