var express = require('express');
var router = express.Router();
var pdfText = require('pdf-text');
var fs = require('fs');
var Q = require('q');
var ResumeModel = require('../models/ResumeModel');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/upload', function(req, res){
    console.log('req.files: ', req.files);
    var files = [];
    var fileNames = [];
    for(var prop in req.files){
        files.push(convertToTxt(req.files[prop]['name']));
        fileNames.push({
            original: prop,
            saved: req.files[prop]['name']
        })
    }

    Q.all(files).then(function(data){
        //console.log('Here: ', data);
        var writeTxtPromises = [];
        var mongoPromises = [];
        var phonePattern= /(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]*\d{3}[\s.-]\d{4}/;
        var emailPattern= /[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?/i;
        var temp ='';
        var obj= {};
        for(var i = 0; i< data.length; i++){
            temp = data[i].join('');
            obj['phone'] = temp.match(phonePattern) ? temp.match(phonePattern)[0] : 'NA';
            obj['email'] = temp.match(emailPattern) ? temp.match(emailPattern)[0] : 'NA';
            obj['resume'] = fileNames[i].original;
            obj['saved'] = fileNames[i].saved;
            obj['timestamp'] = Date.now();
            console.log('obj: ', obj);
            mongoPromises.push(saveResume(obj));
            writeTxtPromises.push(writeToTxt(fileNames[i].original, data[i]));
        }

        Q.all(writeTxtPromises, mongoPromises).then(function(){
            console.log('Success!');
        }).catch(function(err){
            console.log('Error in Writing to TXT: ', err);
        });
        res.send('We gucci');
    });

});

module.exports = router;

var convertToTxt = function (path){
    var defer = Q.defer();
    pdfText('uploads/'+ path, function(err, chunks) {
        if(err) defer.reject(err);
        defer.resolve(chunks);
    });
    return defer.promise;
};

var writeToTxt = function (file, chunks){
    var defer = Q.defer();
    file = file.substring(0, file.lastIndexOf('.'))+ '.txt';
    //console.log('writeToTxt: ', file);
    fs.writeFile('./texts/'+ file, chunks.join(''), function (err) {
        if (err) defer.reject(err);
        defer.resolve();
    });
    return defer.promise;
};

var saveResume = function(obj){
    var defer = Q.defer();
    var query = new ResumeModel(obj);
    query.save(function(err){
        if(err) defer.reject(err);
        else{
            defer.resolve();
        }
    });
    return defer.promise;
};

/* weird splitting
 path = 'uploads/' + req.files[prop]['name'];
 var buffer = fs.readFileSync(path);
 pdfText(buffer, function(err, chunks) {
 console.log(chunks);
 });*/

/*
 var parser = new PDFParser();

 parser.on('pdfParser_dataReady', function(pdf) {
 pdf.data.Pages[0].Texts.forEach(function(text) {
 console.log(unescape(text.R[0].T))
 })
 });

 parser.on('pdfParser_dataError', console.log);


 parser.loadPDF(path);
 */