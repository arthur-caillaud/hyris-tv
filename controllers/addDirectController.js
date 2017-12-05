var ejs = require('ejs');
var fs = require('fs');
var mv = require('mv');
var path = require('path');
var moment = require('moment');
var myConst = require('../configure/myConst');

var htmlContent = require('../models/Html');

var _ViewDir = myConst.ROOT+"views/" + "adminSectionViews/";

var Direct = require('../models/Direct');
var Image = require('../models/Image');

var imageController = require('../controllers/imageController');

/*
 var content = {
 html : htmlContent,
 panelSection : {
 [ section : {
 titre : str,
 lien : str
 ]
 }
 };
 */

var exports = module.exports = {};

exports.postAddDirect = function(nom, description, date, id_image, callback){
    Direct.addNewDirect(nom, description, date, id_image, callback);
}

exports.addDirect = function(req,res,callback){
    var nom = req.body.nom;
    var date = req.body.date;
    var description = req.body.description;
    if(req.file && nom && date && description){
      if(isNaN(Date.parse(date))){
        req.flash('error',"La date n'est pas au format AAAA-MM-JJ !");
        res.redirect('/admin/addDirect');
      }else{
        var extensionImg = req.file.mimetype.split('/')[1];
        var nameImage = Date.now()+'.'+extensionImg; // ms
        upload_tmp_dir = path.join(__dirname,'../uploads/tmp/')
        upload_comp_dir = path.join(__dirname,'../uploads/img/')
        if (!fs.existsSync(upload_comp_dir)) {
            try{
                fs.mkdirSync(upload_comp_dir, 0744);
            }catch(err){
                if (err.code !== 'EEXIST') throw err
            }
        }
        if (!fs.existsSync(upload_tmp_dir)) {
            try{
                fs.mkdirSync(upload_tmp_dir, 0744);
            }catch(err){
                if (err.code !== 'EEXIST') throw err
            }
        }
        mv(upload_tmp_dir+req.file.filename, upload_comp_dir+nameImage, function(err) {
            if(err){
                callback(err,null);
            }else{
              imageController.uploadImage(req, res, nameImage, function(id_image){
                exports.postAddDirect(nom, description, date, id_image, function(err, data){
                    if (err) {
                        callback(err,null);
                    }
                    else {
                        callback(null,data);
                    }
                });
              })
            }
          });
        } // if(isNaN(Date.parse(date)))
      }else{ // if(req.file && nom && date && description){
        req.flash('error',"Tous les champs n'ont pas été remplis");
        res.redirect('/admin/addDirect');
      }
}

exports.getAddDirectPage = function(callback){

    content = {html : htmlContent};
    content.html.head.title = "Ajouter un direct";
    content.html.direct = {};
    content.html.direct.date = htmlContent.data.date;
    content.html.action = "/admin/addDirect"
    content.html.imgRequired = "required"

    ejs.renderFile(_ViewDir + 'manageDirectView.ejs',content,{},function(err, fileContent) {
        if(err){
            callback(err,null);
        }
        else{
            callback(null,fileContent);
        }
    })
};

exports.getModifDirectPage = function(req,res,callback){

    idDirect = req.params.id
    if(!idDirect){
        req.flash('error','Direct inconnu');
        res.redirect('/admin/addDirect');
        return 1;
    }

    Direct.getDirectById(idDirect,function(err,directs){
        if(err){
            callback(err)
        }else{
            var direct = directs[0];
            content = {html : htmlContent};
            content.html.head.title = "Modifier un direct";
            content.html.action = "/admin/modifDirect/"+idDirect;
            content.html.direct = direct;
            content.html.direct.date = moment(direct.date).format("YYYY-MM-DD");
            content.html.direct.infoImg = "Modifier l'image : ";
            content.html.direct.imgActuelle = '<br><a href="'+myConst.WEB_POSTER_DIRECT+direct.nom_image+'"><img src="'+myConst.WEB_POSTER_DIRECT+direct.nom_image+'" height="150px"></a>';
            content.html.imgRequired = ""
            ejs.renderFile(_ViewDir + 'manageDirectView.ejs',content,{},function(err, fileContent) {
                if(err){
                    callback(err,null);
                }
                else{
                    callback(null,fileContent);
                }
            })
        }
    })
};

exports.updateDirect = function(id,req,res,callback){
    var idDirect = id;
    var nom = req.body.nom;
    var date = req.body.date;
    var description = req.body.description;
    if(isNaN(Date.parse(date))){
        req.flash('error',"La date n'est pas au format AAAA-MM-JJ !");
        res.redirect('/admin/modifDirect/'+idDirect);
    }else{
        if(nom && date && description){
            if(req.file){ // si une nouvelle image a été encoyée
                var extensionImg = req.file.mimetype.split('/')[1];
                var nameImage = Date.now()+'.'+extensionImg; // ms
                upload_comp_dir = path.join(__dirname,'../uploads//')
                if (!fs.existsSync(upload_comp_dir)) {
                    try{
                        fs.mkdirSync(upload_comp_dir, 0744);
                    }catch(err){
                        if (err.code !== 'EEXIST') throw err
                    }
                }
                mv(path.join(__dirname,'../uploads/tmp/'+req.file.filename), path.join(__dirname,'../uploads/img/'+nameImage), function(err) {
                    if(err){
                        callback(err,null);
                    }else{
                      Image.updateImageByIdDirect(idDirect, nameImage, function(){
                        Direct.updateDirect(nom, description, date, idDirect, function(err, data){
                            if (err) {
                                callback(err,null);
                            }
                            else {
                                callback(null,data);
                            }
                        });
                      })
                    }
                });
            }else{
                Direct.updateDirect(nom, description, date, idDirect, function(err, data){
                    if (err) {
                        callback(err,null);
                    }
                    else {
                        callback(null,data);
                    }
                });
            }
        }else{ // if(req.file && nom && date && description){
          req.flash('error',"Tous les champs n'ont pas été remplis");
          res.redirect('/admin/modifDirect/'+idDirect);
        }
    }
}
