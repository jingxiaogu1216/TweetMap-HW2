/**
 * Created by jingxiaogu on 11/22/15.
 */
var mongoose = require('mongoose');
var url = 'mongodb://guest:guest@ds057224.mongolab.com:57224/tweetdb';
mongoose.connect(url);

var twitterSchema = mongoose.Schema({
    tweet_id: String,
    user_id: String,
    time: String,
    text: String,
    lat: Number,
    lng: Number,
    keyword: String,
    sentiment: String,
    sentiscore: Number
});

var twitterModel = mongoose.model('Tweet', twitterSchema);
exports.twitterdb = twitterModel;
exports.twitterModel = function(tweet_id,user_id,time,text,lat,lng,keyword,sentiment,sentiscore){
    var _this = this;
    _this.tweet_id = tweet_id;
    _this.user_id = user_id;
    _this.time = time;
    _this.text = text;
    _this.lat = lat;
    _this.lng = lng;
    _this.keyword = keyword;
    _this.sentiment = sentiment;
    _this.sentiscore = sentiscore;
}

exports.twitterModel.getTweetLocationData = function (sentiment, callback) {
    twitterModel.find({sentiment: sentiment},function (err, doc) {
        if (err) {
            console.log("error")
            callback(err, null)
        }
        var ret =[]
        for(var key in doc){
            var list=[]
            list.push(doc[key].lat)
            list.push(doc[key].lng)
            ret.push(list)
        }
        callback(null, ret)
    });
}

exports.twitterModel.getTweetCountData = function (sentiment, callback) {
    twitterModel.count({sentiment: sentiment},function(err,c){
        console.log(err)
        callback(err,c)
    })
}