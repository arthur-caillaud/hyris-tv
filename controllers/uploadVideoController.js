var ejs = require('ejs');
var fs = require('fs');
var path = require('path');
var mv = require('mv')
var myConst = require('../configure/myConst');

var htmlContent = require('../models/Html');
var encodage = require('../models/Encodage');
var direct = require('../models/Direct');
var tag = require('../models/Tag');

var imageController = require('../controllers/imageController');
var videoController = require('../controllers/videoController');
var uploadVideoController = require('../controllers/uploadVideoController');

var _ViewDir = myConst.ROOT+"views/" + "adminSectionViews/";


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

exports.getUploadVideoPage = function(req,res,callback){

	var html = req.HtmlToRender;

	encodage.getListEncodage(function(err,_listEncodage){
		if(err){
			res.status(500).send(err.stack);
		}else{
			html.prototype.addCss([{url : myConst.WEB_CSS + "dropzone.css"}]);
			html.prototype.addInternalJs([{src : myConst.WEB_JS + "dropzone.js"}]);
			html.prototype.addMeta([{name : "csrf-token", content : "XYZ123"}]);

			content = {html : html};
			content.listEncodage = _listEncodage;

			for(var i = 0; i!=content.listEncodage.length; i++){
				content.listEncodage[i].selected = "";
				if(content.listEncodage[i].selectedByDefault)
					content.listEncodage[i].selected = "selected";
			}

			direct.getLastDirects(function(err,_listDirect){
				if(err){
					res.status(500).send(err.stack);
				}else{
					content.listDirect = _listDirect;

					tag.getAllTags(function(err,_listTag){
						if(err){
							res.status(500).send(err.stack);
						}else{
							content.tags = _listTag

							ejs.renderFile(_ViewDir + 'uploadVideoView.ejs',content,{},function(err, fileContent) {
						        if(err){
						            callback(err,null);
						        }
						        else{
						            callback(null,fileContent);
						        }
						    })
						}
					})
				}
			})
		}
	})
};

exports.finalizeUpload = function(req, res) {
    var titre = req.body.titre;
    var token = req.body.token;
    var isPublic = req.body.public;

    var filename = req.body.filename;
	// delete accent, then delete all spaces and non alphaNumeric whith - (including spaces) and get to lowercase
	var nom_video = titre.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^\w]+| /g, '-').toLowerCase()

    var mimetype = req.body.mimetype;
    var extension = mimetype.substring(mimetype.lastIndexOf('/')+1);
    var id_direct = req.body.direct;
    var tag = req.body.tag;
    var date = req.body.date;
    var description = req.body.description;
    var tabEncoding = req.body.associatedEncode.split("_");
    var timePict = req.body.timeMiniature;
    // CHECKER IF file exist
    fs.stat(path.join(__dirname,'../uploads/completed/'+nom_video+'.'+extension), function(err, stat){
        if(err == null){
            res.status(500).send('error : file already exist');
            // send res
        }else if(err.code == 'ENOENT'){
        // file does not exist
	        upload_comp_dir = path.join(__dirname,'../uploads/vid/')
	        if (!fs.existsSync(upload_comp_dir)){
	            try{
	                fs.mkdirSync(upload_comp_dir, 0744);
	            }catch(err){
	                if (err.code !== 'EEXIST') throw err
	            }
	        }
            mv(path.join(__dirname,'../uploads/tmp/'+filename), upload_comp_dir + nom_video + '.' + extension, function(err) {
                if(err) {
                    res.status(500).send(err);
                }
                else {
                    // create image linked in database TODO create image
                    req.imgData = {titre : nom_video + 'Pict.jpg', date : date};
                    imageController.createImgForVideo(req, res, function(resultat){
                        // insert Video Data in database
                        req.dataVideo = { titre : titre, tag : tag, nom_video : nom_video ,
                            description : description, date : date, is_diff : 0, is_private : !isPublic, time_pict : timePict,
                            id_image : resultat.insertId}
                        videoController.insertVideo(req, res, function(err,resVideoAdded){
                            if(err){
                                res.status(500).send(err);
                            }
                            else{
                                encodage.setListEncodageToVideo(tabEncoding,resVideoAdded.insertId, function(err,result){
                                    if(err){
                                        res.status(500).send(err);
                                    }else{
                                        direct.addVideoToDirect(resVideoAdded.insertId,id_direct,function(err,addedToDirect){
                                            if(err){
                                                res.status(500).send(err);
                                            }else{
                                                res.status(200).send("Video uploadée avec succès !");
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    })
                }
            });
        }else{
            // other error
            res.status(500).send(err);
        }
    })
};
