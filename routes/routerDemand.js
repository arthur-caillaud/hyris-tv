var express = require('express');
var router = express.Router();
var flash = require('connect-flash');

var myPassport = require('../configure/myPassport');

var express  =  require( 'express' );
var multer   =  require( 'multer' );
var upload   =  multer( { dest: 'uploads/tmp/' } );
var exphbs   =  require( 'express-handlebars' );
var fs = require('fs');
var myConst = require('../configure/myConst');

var bodyParser = require('body-parser');

var barcoController = require('../controllers/barcoController');
var couvertureController = require('../controllers/couvertureController');
var materielController = require('../controllers/materielController');
var directController = require('../controllers/directController');

router.get('/',function(req,res){
    res.redirect('/demand/barco');
});

router.get('/barco',function (req,res) {
    barcoController.getBarcoPage(function (err, data) {
        if (err) {
            console.error(err.stack);
            res.status(500).send('Something broke!');
        }
        else {
            res.send(data);
        }
    })
});

router.get('/couverture',function (req,res) {
    couvertureController.getCouverturePage(function (err, data) {
        if (err) {
            console.error(err.stack);
            res.status(500).send('Something broke!');
        }
        else {
            res.send(data);
        }
    })
});

router.get('/materiel',function (req,res) {
    materielController.getMaterielPage(function (err, data) {
        if (err) {
            console.error(err.stack);
            res.status(500).send('Something broke!');
        }
        else {
            res.send(data);
        }
    })
})



module.exports = router;
