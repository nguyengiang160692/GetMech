var mongodb = require('mongoose');
mongodb.connect('mongodb://127.0.0.1/SearcherDB');

//----------------------------------------------------------------------------------------------------------------------
var db    = {};
//----------------------------------------------------------------------------------------------------------------------
var Links = mongodb.Schema({
    url      :{type:String, required:true},
    title    :{type:String},
    selectors:[{
        label:{type:String},
        value:{type:String}
    }],
    notify   :{
        toggle    :{type:Number, min:0, max:1, default:0},
        conditions:[
            {
                param    :{type:String},
                condition:{type:String},
                value    :{type:String}
            }
        ]
    },
    //for custom header
    fn       :{
        fnType  :{type:String},
        fnParams:[
            {
                name :{type:String},
                value:{type:String}
            }
        ]
    }
});

Links.statics.all = function(cb){
    var params = {};
    db.link.find(params).exec(function(err, allinks){
        if(err){
            cb && cb(false);
        }
        cb && cb(allinks);
    });
};
Links.statics.get = function(_id, cb){
    var params = {_id:_id};

    db.link.findOne(params).exec(function(err, link){
        if(err){
            cb && cb(false);
        }
        cb && cb(link);
    });
};

//--------------------------------s--------------------------------------------------------------------------------------
db.link        = mongodb.model('Link', Links);
module.exports = db;


