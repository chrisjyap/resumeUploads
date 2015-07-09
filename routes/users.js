var express = require('express');
var router = express.Router();
var ResumeModel = require('../models/ResumeModel');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users');
});

router.get('/resumes', function(req, res){
  ResumeModel.find({ $query: {}, $orderby: { timestamp : -1 } } ,function(err, result) {
    if (err) console.log(err);
    else {
      //console.log(result);
      res.send(result);
    }
  });
});

router.get('/download', function(req, res){
  console.log('req.params', req.query.id);
  res.download('uploads/'+req.query.id, req.query.name);
});
module.exports = router;
