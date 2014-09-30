var express = require('express');
var router = express.Router();

var html_dir = './html/';

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/game', function(req, res){
	res.sendfile(html_dir + 'game.html');
});

module.exports = router;
