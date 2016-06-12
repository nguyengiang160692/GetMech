var mongodb = require('mongoose');
mongodb.connect('mongodb://127.0.0.1/SearcherDB');

//----------------------------------------------------------------------------------------------------------------------
var db    = {};
//----------------------------------------------------------------------------------------------------------------------
var Links = mongodb.Schema({
    url     :{type:String, required:true},
    title   :{type:String},
    selector:{type:String},
    notify  :{type:Boolean, default:false},
    fn      :{
        fnType :{type:String},
        fnParam:[
            {type:String}
        ]
    }
});

//cb:function(),
//id:MongoId // for one link

Links.statics.links = function(obj){
    var params = {};

    if(obj.id){
        params._id = obj.id;
    }

    db.links.find(params).exec(function(err, allinks){
        if(err){
            obj.cb && obj.cb(false);
        }
        obj.cb && obj.cb(allinks);
    });
};

//----------------------------------------------------------------------------------------------------------------------
db.links = mongodb.model('Link', Links);

module.exports = db;


