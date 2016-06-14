var mongodb = require('mongoose');
mongodb.connect('mongodb://127.0.0.1/SearcherDB');

//----------------------------------------------------------------------------------------------------------------------
var db              = {};
//----------------------------------------------------------------------------------------------------------------------
var Links           = mongodb.Schema({
    url     :{type:String, required:true},
    title   :{type:String},
    selector:{type:String},
    notify  :{type:Boolean, default:false},
    fn      :{
        fnType  :{type:String},
        fnParams:[
            {
                name :{type:String},
                value:{type:String}
            }
        ]
    }
});
Links.statics.links = function(cb){
    var params = {};

    db.link.find(params).exec(function(err, allinks){
        if(err){
            cb && cb(false);
        }
        cb && cb(allinks);
    });
};
//----------------------------------------------------------------------------------------------------------------------
db.link             = mongodb.model('Link', Links);
module.exports      = db;


