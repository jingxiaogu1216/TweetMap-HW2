/**
 * Created by huisu on 11/30/15.
 */
var dbModels = require('../model/dbModel');
var retObj = require('../model/ret-obj');

exports.getTweet= function(req, res){
    dbModels.twitterModel.getTweetLocationData(req.query.sentiment,function (err, doc) {
        if (err != null) {
            res.send(
                retObj.getOrdinaryReturnObject(
                    false,
                    err.message
                )
            );
        } else if (doc) {
            res.send(
                JSON.stringify(doc)
            );
        } else {
            res.send(
                retObj.getOrdinaryReturnObject(
                    true,
                    'ok,noData'

                )
            )
        }
    });
}

exports.countTweet= function(req, res){
    dbModels.twitterModel.getTweetCountData(req.query.sentiment,function (err,doc) {
        console.log(doc);
        if (err != null) {
            res.send(
                retObj.getOrdinaryReturnObject(
                    false,
                    err.message
                )
            );
        } else if (doc) {
            res.send(
                JSON.stringify(doc)
            );
        } else {
            res.send(
                retObj.getOrdinaryReturnObject(
                    true,
                    'ok,noData'

                )
            )
        }
    });
}