/**
 * Created by huisu on 10/17/15.
 */
var tweetmap = tweetmap || {}
tweetmap.map = tweetmap.map || {}
tweetmap.map.statMap = function(){

}

tweetmap.map.statMap.getWoeid = function (ngHttp,keyword, callBack) {
    console.log(tweetmap.map.config.woeid+'"'+keyword+'"')
    tweetmap.utils.ngWebService(
        'GET',
        tweetmap.map.config.woeid+'"'+keyword+'"',
        {},
        ngHttp,
        function (data) {
            console.log(data.query.results.Result.woeid)
            tweetmap.map.statMap.getStatMapData(
                ngHttp,
                data.query.results.Result.woeid,
                function (trendList) {
                    console.log(trendList)
                    if(trendList==undefined) {
                        ret=[]
                        ret.push({name:"No topic in this area. Please try again."})
                        callBack(ret)
                    }else{
                        callBack(trendList[0].trends);
                    }
                }
            )
        });
}


tweetmap.map.statMap.getStatMapData = function (ngHttp,keyword, callBack) {
    tweetmap.utils.ngWebService(
        'GET',
        tweetmap.map.config.trendData,
        {
            woeid:keyword,
        },
        ngHttp,
        function (data) {
            callBack(data.trends);
        });
}

tweetmap.map.statMap.countMapData = function (ngHttp,keyword, callBack) {
    tweetmap.utils.ngWebService(
        'GET',
        tweetmap.map.config.countData,
        {
            sentiment:keyword,
        },
        ngHttp,
        callBack
    )}

