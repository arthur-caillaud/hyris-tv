var ejs = require('ejs');
var fs = require('fs');
var path = require('path');
var moment = require('moment');
var myConst = require('../configure/myConst');

var htmlContent = require('../models/Html');
var encodage = require('../models/Encodage');
var direct = require('../models/Direct');
var tag = require('../models/Tag');
var db = require('../db_management/db');

var imageController = require('../controllers/imageController');
var videoController = require('../controllers/videoController');
var uploadVideoController = require('../controllers/uploadVideoController');

var Video = require('../models/Video');

var _ViewDir = myConst.ROOT + "views/" + "adminSectionViews/";



var exports = module.exports = {};

exports.getModificationVideoPage = function(req, res, callback) {
    var html = req.HtmlToRender;
    var idVideo = req.params.idVideo;
    // avoir l'id de la video à modifier et charger les infos de cette video puis les ajouter dans le content
    Video.getVideoById(idVideo, function(err, result) {
        if (err) {
            res.status(500).send(err.stack);
        } else {
            if (!result[0]) {
                req.flash('info', 'La vidéo demandé n\'existe pas.')
                res.redirect('/')
            } else {
                Video.getEncodedById(idVideo, function(err, encodages) {
                    if (err) {
                        res.status(500).send(err.stack);
                    } else {
                        encodage.getListEncodage(function(err, _listEncodage) {
                            if (err) {
                                res.status(500).send(err.stack);
                            } else {
                                var video_to_modify = result[0];
                                html.data.old_vid = {
                                    titre: video_to_modify.titre,
                                    description: video_to_modify.description,
                                    id: idVideo,
                                    tag: video_to_modify.tag.split(','),
                                    date: moment(video_to_modify.date).format("YYYY-MM-DD"),
                                    public_state: video_to_modify.is_private == 1 ? "checked" : "",
                                    time_pict: video_to_modify.time_pict
                                };
                                content = {
                                    html: html,
                                    video: {
                                        video_to_play: {}
                                    },
                                    encodages: []
                                };
                                content.listEncodage = _listEncodage;
                                for (var i = 0; i != content.listEncodage.length; i++) {
                                    content.listEncodage[i].selected = "";
                                    for(id in encodages){
                                        if(encodages[id].label === content.listEncodage[i].label){
                                            content.listEncodage[i].selected = "selected";
                                            break
                                        }
                                    }
                                }

                                video_to_play = result[0];
                                video_to_play.url = myConst.WEB_VIDEO + video_to_play.nom_video + ".mp4";
                                video_to_play.poster = myConst.WEB_MINIATURE + video_to_play.nom_image;
                                video_to_play.tag = db.toHashtagsTags(video_to_play.tag);
                                Video.prototype.formatDate(video_to_play, "D/M/Y");
                                content.video.video_to_play = video_to_play;

                                for (var i = 0; i != encodages.length; i++) {
                                    if (encodages[i].type == "video/mp4") {
                                        var encode = {
                                            url: myConst.WEB_VIDEO + "encode_tmp/" + encodages[i].label + "/" + video_to_play.nom_video + ".mp4",
                                            type: encodages[i].type,
                                            name: encodages[i].label,
                                            //value: encodages[i].label.substr(0, -1)
                                        }
                                        content.encodages.push(encode)
                                    }
                                }
                                if (encodages.length == 0) {
                                    content.encodages = [{
                                        url: myConst.WEB_VIDEO + video_to_play.nom_video + ".mp4",
                                        type: "video/mp4",
                                        name: "720p",
                                        //value: "720"
                                    }]
                                }

                                content.html.prototype.addInternalJs([{
                                    src: myConst.WEB_JS + "videojs-resolution-switcher.js"
                                }])
                                tag.getAllTags(function(err,_listTag){
            						if(err){
            							res.status(500).send(err.stack);
            						}else{
            							content.tags = _listTag
                                        ejs.renderFile(_ViewDir + 'modificationVideo.ejs', content, {}, function(err, fileContent) {
                                            if (err) {
                                                callback(err, null);
                                            } else {
                                                callback(null, fileContent);
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        }
    })
};

exports.modifyVideo = function(req, res) {
    var titre = req.body.titre;
    var description = req.body.description;
    var date = req.body.date;
    var is_private = req.body.is_private === undefined ? 0 : 1;
    var tag = req.body.tag;
    var time_pict = req.body.time_pict;
    var active = req.body.is_deleted ? 0 : 1;
    var id = req.body.id;
    var encodeIds = req.body.encodage;
    var id_direct = req.body.id_direct;
    Video.updateVideoById(id, titre, date, description, is_private, tag, time_pict, active, id_direct, function(err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            encodage.updateListEncodage(req,id,encodeIds,function(err,data){
                if(err){
                    res.status(500).send(err);
                }else{
                    req.flash('success','Vidéo modifiée avec succès !');
                    res.redirect('/video/' + id);
                }
            })
        }
    })
};
