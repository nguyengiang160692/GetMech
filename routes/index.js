var express = require('express');
var leecher = require(__base + 'routes/leecher')('/leecher');

module.exports = function(app){
    /* GET home page. */
    app.get('/', function(req, res, next){
        res.render('index', {title:'Express'});
    });

    app.get(leecher.url, function(req, res, next){
        leecher.getList();

    });
    return app;
};
