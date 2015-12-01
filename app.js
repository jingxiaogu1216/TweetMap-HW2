var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Twit = require('twit');
var http = require('http');
var AWS = require('aws-sdk');
var awsconfig = require('./config/awsconfig');
var workerpool = require('workerpool');
var twitconfig = require('./config/twitconfig');

var pool = workerpool.pool(__dirname + '/controller/worker.js');

var routes = require('./routes/index');
var users = require('./routes/users');


var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = 8081;
server.listen(port);
console.log("listening on port " + port);




AWS.config.update({
    'accessKeyId': awsconfig.accessKey,
    'secretAccessKey': awsconfig.secretAccessKey,
    'region': awsconfig.region
});



// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//initialize AWS SQS
var sqs = new AWS.SQS();
var sqsSetParams = {
    QueueUrl: awsconfig.queueUrl,
    Attributes: {
        'Policy': JSON.stringify({})
    }
};

//set SQS attribute
sqs.setQueueAttributes(sqsSetParams, function(err, data) {
    if (err) console.log(err, err.stack);
     // an error occurred
});

var sqsSendParams = {
    QueueUrl: awsconfig.queueUrl,
    MessageAttributes: {
        someKey: { DataType: 'String', StringValue: "string"}
    }
};

var T = new Twit({
    consumer_key: twitconfig.consumer_key,
    consumer_secret: twitconfig.consumer_secret,
    access_token: twitconfig.access_token,
    access_token_secret: twitconfig.access_token_secret
});


var filter= {track: 'food', locations: '-74,40,-73,41'};// New York
var stream = T.stream('statuses/filter',filter);


stream.on('tweet', function (tweet) {
    if (tweet.coordinates) {
        var obj = {
            'tweet_id': tweet.id,
            'user_id': tweet.user.id,
            'time': tweet.user.created_at,
            'text': tweet.text,
            'lat': tweet.coordinates.coordinates[1],
            'lng': tweet.coordinates.coordinates[0],
            'keyword': 'food'
        };
        sqsSendParams.MessageBody = JSON.stringify(obj);
        //send message to SQS
        console.log('send message');
        sqs.sendMessage(sqsSendParams, function (err, data) {
            if (err) console.log(err, err.stack);
        });
    }
});



var getMessageFromSQS = function () {
    var sqsRecieveParams = {
        QueueUrl: awsconfig.queueUrl,
        MaxNumberOfMessages: 10
    };
    //receive message from SQS
    sqs.receiveMessage(sqsRecieveParams, function (err, data) {
        if (data && data.Messages && data.Messages.length > 0) {
            var len = data.Messages.length;
            for (var i = 0; i < len; i++) {
                console.log('receive message');
                var message = data.Messages[i];
                var body = message.Body;
                //do sentiment analysis
                pool.exec('TweetSentimentAnalysis', [body]);
                deleteMessageFromSQS(message);
            }
        }
    });
};


setInterval(getMessageFromSQS, 100);

//delete message from SQS
var deleteMessageFromSQS = function (message) {
    var sqsDeleteParams = {
        QueueUrl: awsconfig.queueUrl,
        ReceiptHandle: message.ReceiptHandle
    };
    sqs.deleteMessage(sqsDeleteParams, function(err, data) {
       if (err) console.log(err);
    });
};



//subscribe message
var sns = new AWS.SNS();
var snsSubscribeParams = {
    Protocol: 'http',
    TopicArn:  awsconfig.snsTopicARN,
    Endpoint: 'http://52.91.244.233:9000/receive'
};


sns.subscribe(snsSubscribeParams, function (err, data) {
    //console.log(data);
});


module.exports = app;
