var express = require('express');
var router = express.Router();
var trend = require('../controller/trend');
var heat = require('../controller/dbControl');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/trend', function(req, res, next) {
  res.render('trend', { title: 'Express' });
});

router.get('/stat', function(req, res, next) {
  res.render('stat', { title: 'Express' });
});


module.exports = router;
router.get('/trendlist', trend.trends);
router.post('/heatmap', heat.getTweet);
router.get('/count', heat.countTweet);