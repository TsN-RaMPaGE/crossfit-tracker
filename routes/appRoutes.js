var express = require('express');
var router = express.Router();

// Render html files
router.get('*', function(req, res) {
  res.sendfile('./public/html/layout.html');
});

/*
// Render jade files
router.get('*',function(req,res) {
  res.render('layout',{'title' : 'Home'});
});*/


module.exports = router;
