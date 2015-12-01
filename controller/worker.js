/**
 * Created by jingxiaogu on 11/23/15.
 */

var AWS = require('aws-sdk');
var awsconfig = require('../config/awsconfig');
var workerpool = require('workerpool');
var AlchemyAPI = require('./alchemyapi');
var alchemyapi = new AlchemyAPI();

AWS.config.update({
    'accessKeyId': awsconfig.accessKey,
    'secretAccessKey': awsconfig.secretAccessKey,
    'region': awsconfig.region
});


var sns = new AWS.SNS();
var snsPublishParams = {
    TopicArn: awsconfig.snsTopicARN,
    MessageAttributes: {
    }
};


AWS.config.update({
    'accessKeyId': awsconfig.accessKey,
    'secretAccessKey': awsconfig.secretAccessKey,
    'region': awsconfig.region
});

function TweetSentimentAnalysis(message) {
    var obj = JSON.parse(message);
    alchemyapi.sentiment("text", obj.text, {}, function (response) {
        if (response.docSentiment != undefined && response.docSentiment.type != undefined) {
            obj.sentiment = response.docSentiment.type;
            if (obj.sentiment == 'neutral') {
                obj.sentiscore = 0;
            }
            else obj.sentiscore = response.docSentiment.score;
            snsPublishParams.Message = JSON.stringify(obj);
          //  console.log('sentimentAnalysis done');
            sns.publish(snsPublishParams, function (err, data) {
                if (err) console.log(err);
            });
        }
    });
}




workerpool.worker({
    TweetSentimentAnalysis: TweetSentimentAnalysis
});

