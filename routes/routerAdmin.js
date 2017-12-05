var express = require('express');
var router = express.Router();
var flash = require('connect-flash');
var multer   =  require( 'multer' );
var upload   =  multer( { dest: 'uploads/tmp/' } );
var exphbs   =  require( 'express-handlebars' );
var fs = require('fs');
var path = require('path');

var myPassport = require('../configure/myPassport');
var myConst = require('../configure/myConst');

var Html = require('../models/Html');

var adminController = require('../controllers/adminController');
var uploadVideoController = require('../controllers/uploadVideoController');
var addDirectController = require('../controllers/addDirectController');
var manageRightsController = require('../controllers/manageRightsController');
var manageMailingListController = require('../controllers/manageMailingListController');
var manageDemandController = require('../controllers/manageDemandController');
var imageController = require('../controllers/imageController');
var videoController = require('../controllers/videoController');
var roleController = require('../controllers/roleController');
var modificationVideoControlleur = require('../controllers/modificationVideoControlleur')

//app.use(bodyParser.json()); // support json encoded bodies
//router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// middelware verification droit admin

//router.use('/',isGranted('admin'))

router.use(function(req,res,next){
  Html.prototype.addCss([{url:myConst.WEB_CSS + 'admin.css'}]);
  next()
})

router.get('/',function(req,res){
    res.redirect('/admin/uploadVideo')
});

//router.use('/uploadVideo',isGranted('uploadVideo'))

router.get('/uploadVideo',function(req,res){
     uploadVideoController.getUploadVideoPage(req,res,function (err,data) {
         if (err) {
            console.error(err.stack);
            res.status(500).send('Something broke!');
         }
         else {
           res.status(200).send(data);
         }
     })
});
router.post('/addVideoAlone', upload.single( 'file' ), function( req, res, next ) {
    // check meta data here (in req.file)
    res.status( 200 ).send( req.file );
});

router.post('/addVideo',  uploadVideoController.finalizeUpload);


router.get('/addDirect', function (req,res) {
    addDirectController.getAddDirectPage(function (err,data) {
        if (err) {
            console.error(err.stack);
            res.status(500).send('Something broke!');
        }
        else {
            res.send(data);
        }
    })
})

router.post('/addDirect',
            upload.single('imageToUpload'),
            function(req,res){
                addDirectController.addDirect(req,res,
                    function(err,data){
                        if (err) {
                            console.error(err.stack);
                            res.status(500).send('Something broke!');
                        }
                        else {
                            req.flash('success','Le direct a bien été créé.')
                            res.redirect('/admin/addDirect');
                        }
                    })
});

router.get('/modifDirect/:id', function (req,res) {
    addDirectController.getModifDirectPage(req,res,function (err,data) {
        if (err) {
            console.error(err.stack);
            res.status(500).send('Something broke!');
        }
        else {
            res.send(data);
        }
    })
})

router.post('/modifDirect/:id',
    upload.single('imageToUpload'),
    function(req,res){
        idDirect = req.params.id
        if(!idDirect){
            req.flash('error','Direct inconnu');
            res.redirect('/admin/addDirect');
            return 1;
        }
        addDirectController.updateDirect(idDirect,req,res,
            function(err,data){
                if (err) {
                    console.error(err.stack);
                    res.status(500).send('Something broke!');
                }
                else {
                    req.flash('success','Le direct a bien été modifié.')
                    res.redirect('/direct/'+idDirect);
                }
            });
});

/*
router.post('/addDirect', function (req,res) {
    if (nom && description && date && imageName) {
      imageController.uploadImage(req, res, imageName, function(id_image){
          addDirectController.postAddDirect(nom, description, date, id_image, function(err, data){
              if (err) {
                  console.error(err.stack);
                  res.status(500).send('Something broke!');
              }
              else {
                  console.log('redirected');
                  res.redirect('/admin/addDirect');
              }
          });
      });
    }else {
        console.log('redirected, but undefined variables');
        res.redirect('/admin/addDirect');
    }

})
*/
router.get('/manageDemand', function (req,res) {
    manageDemandController.getManageDemandPage(function (err,data) {
        if (err) {
            console.error(err.stack);
            res.status(500).send('Something broke!');
        }
        else {
            res.send(data);
        }
    })
})

router.get('/manageRights', function (req,res) {
    manageRightsController.getManageRightsPage(req, res, function (err,data) {
        if (err) {
            console.error(err.stack);
            res.status(500).send('Something broke!');
        }
        else {
            res.send(data);
        }
    })
})

router.get('/manageMailingList', function (res, res) {
    manageMailingListController.getManageMailingListPage(function (err,data) {
        if (err) {
            console.error(err.stack);
            res.status(500).send('Something broke!');
        }
        else {
            res.send(data);
        }
    })
})

router.get('/manageRole', function (req,res) {
    roleController.getRoleManagementPage(function (err,data) {
        if (err) {
            console.error(err.stack);
            res.status(500).send('Something broke!');
        }
        else {
            res.send(data);
        }
    })
})

router.get('/modifVideo/:idVideo', function(req,res) {
    modificationVideoControlleur.getModificationVideoPage(req, res, function(err, data){
        if(err) {
            console.error(err.stack);
            res.status(500).send('Something broke!');
        }
        else {
            res.send(data);
        }
    })
})
router.post('/modifVideo/', modificationVideoControlleur.modifyVideo);
/*
router.get('/modifyDirect/:idDirect',function (req,res) {
    modifyDirectController.getModifyDirectPage(req,res,function(err,data){
        if(err){
            console.error(err.stack);
            res.status(500).send('Something broke!');
        }
        else {
            res.send(data);
        }
    })
})*/


module.exports = router;
