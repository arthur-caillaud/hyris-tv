var ejs = require('ejs');
var fs = require('fs');

var Direct = require('../models/Direct');
var myConst = require('../configure/myConst');
var Video = require('../models/Video');
var htmlContent = require('../models/Html');
var voteController = require('../controllers/voteController');
var db = require('../db_management/db')

/*
var content = {
  html : htmlContent,
  img_url : unurld'image
  video : [
      {url : "http://138.195.132.49/generique-rcs-2k16-encode.mp4", img_url = "http://unurl.jpg", name = "nom_video"},
      {url : "http://138.195.132.49/generique-rcs-2k16-encode.mp4", img_url = "http://unurl.jpg", name = "nom_video"},
      {url : "http://138.195.132.49/generique-rcs-2k16-encode.mp4", img_url = "http://unurl.jpg", name = "nom_video"}
    ]
  }
};
*/

var exports = module.exports = {};
var _ViewDir = myConst.ROOT+"views/";

var videos_slider = [];

function getDirectSliderContent(req,res,id,callback) {
    Direct.getDirectNameAndImageById(id, function(err, result) {
        if (err)
            callback(err,null);
        else {
            if(result[0]){
                directNom = result[0].nom
                img_url = myConst.WEB_IMG + result[0].nom_image
                if (!(img_url))
                    img_url = myConst.WEB_DIRECT_DEFAULT_IMG
                Direct.getVideosListByDirectId(id, function(err,videos_slider){
                    if(err)
                        callback(err,null);
                    else{
                        videos_slider.forEach(function(video){
                        /*video.img_url = myConst.WEB_MINIATURE + video.nom_image;*/
                            video.url = myConst.WEB_VIDEO + video.nom_video + ".mp4";
                            video.titre = video.nom_video
                        });
                        callback(null,{
                            html : htmlContent ,
                            nom : directNom,
                            img_url : img_url,
                            videos : {
                                slider : {
                                    titre : directNom,
                                    videos : videos_slider
                                }
                            }
                        })
                    }
                });
            }else{
                req.flash('info','Ce direct n\'existe pas!')
                res.redirect('/')
            }
        }
    });
}

exports.getDirectRootPage = function (pageNumber,req,res,callback) {
    Direct.getDirectRootViewData(function (err,data) {
        if (err) {
            callback(err, null);
        }
        if (data){
            content = {html : htmlContent};
            const i0 = (pageNumber-1)*20;
            content.directDiv = data.slice(i0,Math.min(i0+20,data.length));
            for (let i = 0; i < Math.min(20,data.length-pageNumber*20); i++){
                content.directDiv[i].nom = data[i0+i].nom;
                content.directDiv[i].date = db.toStandardDate(data[i0+i].newDate);
                content.directDiv[i].description = db.toMinifiedDescription(data[i0+i].description);
                content.directDiv[i].imgurl = myConst.WEB_POSTER_DIRECT + data[i0+i].nom_image;
                content.directDiv[i].url = "/direct/"+data[i0+i].id;
            }
            ejs.renderFile(myConst.VIEW_DIR + 'directRootView.ejs', content, {}, function(err, fileContent) {
                if (err) {
                    callback(err,null)
                }
                else {
                    callback(null,fileContent)
                }
            })
        }})
};

exports.getVideoPage = function(req,res,callback){
    getDirectSliderContent(req,res,req.params.nombre,function(err, content){
        if(err)
            callback(err,null);
        else{
            ejs.renderFile(_ViewDir + 'directView.ejs', content, {}, function(err, fileContent) {
                if(err){
                    callback(err,null);
                }
                else{
                    callback(null,fileContent)
                }
            });
        }
    });
};

exports.getDirectPage = function (req,res,callback) {
    if (req.params.id) {
        directId = req.params.id;
        if (!isNaN(directId)){
            Direct.getDirectById(directId, function (err, data) {
                if (err) {
                    callback(err, null)
                }
                else {
                    if (data[0]) {
                        content = {html: htmlContent};
                        content.direct = data[0];
                        content.direct.date = db.toStandardDate(data[0].newDate);
                        content.direct.description = db.toMinifiedDescription(data[0].description);
                        content.direct.imgurl = myConst.WEB_POSTER_DIRECT + data[0].nom_image;
                        Video.getVideoListByDirectId(directId, function (error, videosData) {
                            if (error) {
                                callback(error, null)
                            }
                            else {
                                videosData.forEach(function (videoData) {
                                    hashTags = db.toHashtagsTags(videoData.tag);
                                    videoData.link = "/video/" + videoData.id_video;
                                    videoData.newDate = db.toStandardDate(videoData.newDate);
                                    videoData.tag = hashTags;
                                    videoData.miniTitle = db.toMinifiedTitle(videoData.titre);
                                    if (videoData.nom_image){
                                        videoData.miniature = myConst.WEB_MINIATURE + videoData.nom_image;
                                    }
                                    else {
                                        videoData.miniature = myConst.WEB_MINIATURE + myConst.DEFAULT_MINIATURE;
                                    }
                                });
                                content.directVideos = videosData;
                                ejs.renderFile(myConst.VIEW_DIR + 'directView.ejs', content, {}, function (err, fileContent) {
                                    if (err) {
                                        callback(err, null)
                                    }
                                    else {
                                        callback(null, fileContent);
                                    }
                                })
                            }
                        })
                    }
                    else {
                        req.flash('info',"Ce direct n'existe pas.");
                        res.redirect('/');
                    }
                }
            })
        }
        else {
            req.flash('info',"Paramètre incorrect. Retour à la page d'accueil.");
            res.redirect('/');
        }
    }
    else {
        req.flash('info','Paramètre non fourni.');
        res.redirect('/');
    }
};
