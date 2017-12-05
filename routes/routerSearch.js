var express = require('express');
var router = express.Router();
var flash = require('connect-flash');
var ejs = require('ejs');
var fs = require('fs');

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
var directController = require('../controllers/directController');
var searchController = require('../controllers/searchController');
var tagController = require('../controllers/tagController');
var videoController = require('../controllers/videoController');
var db = require('../db_management/db');
var htmlContent = require('../models/Html');
var myConst = require('../configure/myConst');

router.post('/search',searchController.searchEngine);
router.get('/search/ajax', searchController.ajaxSearchEngine);
router.get('/search/ajaxTag', searchController.ajaxTagSearchEngine);

router.get('/video/:id',videoController.getVideoPageById);

router.get('/direct/:id',function(req,res){
    directController.getDirectPage(req,res,function (err,pageContent) {
        if (err){
            console.error(err.stack);
            res.status(500).send("Something broke")
        }
        if (pageContent){
            res.send(pageContent)
        }
    })
});

router.get('/direct', function(req,res){
    directController.getDirectRootPage(1,req,res,function (err,page) {
        if (err){
            console.error(err.stack);
            res.status(500).send("Something broke")
        }
        else{
            res.send(page)
        }
    })
});

router.get('/direct/page/:id', function (req,res) {
    if (req.params.id){
        directController.getDirectRootPage(req.params.id,req,res,function (err,page) {
            if (err){
                console.error(err.stack);
                res.status(500).send("Something broke")
            }
            else{
                res.send(page)
            }
        })
    }
    else {
        req.flash('info','Aucun paramètre fourni pour /direct/ajaxPage')
        res.redirect('/')
    }
})

router.get('/tag/:tag',function (req,res) {
    if (req.params.tag){
        tagController.getTagPage(req,res,function (err,page) {
            if (err){
                console.error(err.stack);
                res.status(500).send("Something broke")
            }
            else {
                res.send(page)
            }
        })
    }
    else {
        req.flash('info',"Aucun tag fourni");
        res.redirect('/');
    }

});

router.get('/tag',function(req,res){
    tagController.getTagCloud(req,res,function (err,page) {
        if (err){
            console.error(err.stack);
            res.status(500).send("Something broke")
        }
        else {
            res.send(page)
        }
    })
})


module.exports = router;
