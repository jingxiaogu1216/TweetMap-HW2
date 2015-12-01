/**
 * Created by huisu on 11/29/15.
 */
var Twit = require('twit');
var twitconfig = require('../config/twitconfig');
var T = new Twit({
    consumer_key: twitconfig.consumer_key,
    consumer_secret: twitconfig.consumer_secret,
    access_token: twitconfig.access_token,
    access_token_secret: twitconfig.access_token_secret
});

exports.trends = function(req, res) {
    var woeid = req.query.woeid;
    T.get('trends/place', {id: woeid}, function(err, data) {
        console.log(data);
        if (data == undefined) {
            res.json({status: false});
        } else {
            res.json({trends: data, status: true});
        }
    });
};