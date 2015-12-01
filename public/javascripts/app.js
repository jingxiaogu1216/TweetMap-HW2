/**
 * Created by huisu on 10/18/15.
 */
var  tweetmap = tweetmap  || {}
tweetmap.map = tweetmap.map|| {}

//config
tweetmap.map.config = {
    woeid: 'http://query.yahooapis.com/v1/public/yql?format=json&q=select%20*%20from%20geo.placefinder%20where%20text=',
    trendData:'/trendlist',
    countData:'/count'
}