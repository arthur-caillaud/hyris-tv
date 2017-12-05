var exports = module.exports = {};
var ejs = require('ejs');
var myConst = require('../configure/myConst');

var Video = require('../models/Video');
var Direct = require('../models/Direct');
var db = require('../db_management/db')

exports.searchEngine = function(req,res,next){
    var searchQuery = req.body.search.q;
    Video.getVideoBySearch(searchQuery,function(err,tabVideo) {
        if(err)
            res.status(500).send(err.stack);
        else{
            content={
              video : {
                video_to_play : {},
                slider : {
                          titre : "Autres videos",
                          videos : []
                        }
              },
            };
            if(tabVideo[0]){
                video_to_play=tabVideo[0];
                /*
                video_to_play.url = myConst.WEB_VIDEO + video_to_play.nom_video + ".mp4";
                video_to_play.poster = myConst.WEB_POSTER + video_to_play.nom;
                Video.prototype.formatDate(video_to_play,"D/M/Y");
                content.html=req.HtmlToRender;
                content.video.video_to_play=video_to_play;
                var nombreVideoSlider = tabVideo.length;
                if(nombreVideoSlider > myConst.NOMBRE_VID_MAX_SLIDER)
                  nombreVideoSlider = myConst.NOMBRE_VID_MAX_SLIDER;
                for(var i = 1; i!=nombreVideoSlider; i++){
                  if(tabVideo[i]){
                      Video.prototype.formatDate(tabVideo[i],"Y");
                      if(tabVideo[i].nom_image){
                          tabVideo[i].poster = myConst.WEB_MINIATURE + tabVideo[i].nom_image;
                      }
                      else {
                          tabVideo[i].poster = myConst.WEB_MINIATURE + "defaultMiniature.jpg";
                      }
                      tabVideo[i].link = "/video/" + tabVideo[i].id;
                      content.video.slider.videos.push(tabVideo[i]);
                  }else{
                      tabVideo=[];
                  }
                }
                ejs.renderFile(myConst.VIEW_DIR + 'watchVideo.ejs', content, {}, function(err, fileContent){
                				if(err)
                					res.status(500).send("error : " + err);
                				else{
                					res.send(fileContent);
                				}
                			});
                */
                    res.redirect('/video/'+video_to_play.id);
                }else{
                    req.flash('info',"Aucune video n'a été trouvée.")
                    res.redirect('/');
                }
        }
    });
}

exports.ajaxSearchEngine = function (req,res) {
    var searchQuery = req.query.q;
    Video.getVideoBySearch(searchQuery,function (err,tabVideo) {
        ajaxData = [];
        if (err){
            res.status(500).send(err.stack);
        }
        else {
                tabVideo.forEach(function (result) {
                    ajaxData.push({label : result.titre, type: "Video", id : result.id, score : result.score, date : result.date, description : result.description})
                })
            }
            Direct.getDirectBySearch(searchQuery,function (err,tabDirect) {
                if (ajaxData){
                    if (err){
                        console.error(err.stack)
                        res.status(500).send(err.stack);
                    }
                    else {
                        tabDirect.forEach(function (result) {
                            ajaxData.push({label : result.nom, type: "Direct", id : result.id, score : result.score, date : result.date, description : result.description})
                        })
                        res.send(ajaxData)
                    }
                }
            })
    })
}

exports.ajaxTagSearchEngine = function (req, res) {
    var q = req.query.q + "\w+"
    var sqlQuery = "SELECT tag,id FROM Tag WHERE tag REGEXP (?)";
    var inserts = [q];
    db.formatedQuery(sqlQuery,inserts, function (error,tabTag){
        ajaxData = [];
        if (error)
            res.status(500).send(error.stack)
        else
            if(tabTag.length >= 5){
                for (var i = 0; i<5; i++){
                    ajaxData.push({tag : tabDirect[i].tag, type: "Tag", id : tabDirect[i].id})
                }
            }
            else {
                tabTag.forEach(function (result) {
                    ajaxData.push({tag : result.tag, type: "Tag", id : result.id})
                })
            }
            res.send(ajaxData)
    });
}
