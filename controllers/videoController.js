
var ejs = require('ejs');
var fs = require('fs');
var db = require('../db_management/db')
var myConst = require('../configure/myConst');
var Video = require('../models/Video');
var Direct = require('../models/Direct');
var htmlContent = require('../models/Html');
var voteController = require('../controllers/voteController');

/*
var content = {
  html : htmlContent,
  video : {
    video_to_play : {url : video_to_play.url},
    videos_slider : [
      {url : "http://138.195.132.49/generique-rcs-2k16-encode.mp4"},
      {url : "http://138.195.132.49/generique-rcs-2k16-encode.mp4"},
      {url : "http://138.195.132.49/generique-rcs-2k16-encode.mp4"}
    ]
  }
};
*/

var exports = module.exports = {};

var _ViewDir = myConst.ROOT+"views/";

/*
function getVideoPlayerSliderContent(callback){
	var video_to_play = {};
	var videos_slider = [];
	Video.getVideoById(3,function(err,result){
	if(err)
		callback(err,null);
	else
		video_to_play=result[0];
		video_to_play.url = myConst.WEB_VIDEO + video_to_play.nom_video + ".mp4";


		Video.getVideoListByIds([3,4,5,7,8],function(err,result){
			if(err)
				callback(err,null);
			else{
				result.forEach(function(video){
					var video_rul = myConst.WEB_VIDEO + video.nom_video + ".mp4";
					videos_slider.push({url : video_rul});
				});
				callback(null,{
					html : htmlContent,
					video : {
						video_to_play : video_to_play,
						slider : {
											titre : "Autres videos",
											videos : videos_slider
										}
					 }
				})
			}
		});

	});
}*/

exports.getPublicHome = function(req,res,callback){
    Video.getPublicVideo(function(err,data){
        if(err)
            callback(err,null);
        else {
            htmlContent.prototype.addCss([
                {url : myConst.WEB_CSS+"public-home.css"}
            ]);
            htmlContent.prototype.addInternalJs([
                {src : myConst.WEB_JS + "general.js"},
                {src : myConst.WEB_JS + "typed.min.js"},
            ]);
            content = {html : htmlContent};
            content.publicVideos = data;
            content.publicVideos.forEach(function(publicVideo){
                publicVideo.link = "/video/" + publicVideo.id_video;
                publicVideo.newDate = db.toStandardDate(publicVideo.newDate);
                publicVideo.miniTitle = db.toMinifiedTitle(publicVideo.titre);
                if (publicVideo.nom_image){
                    publicVideo.miniature = myConst.WEB_MINIATURE + publicVideo.nom_image;
                }
                else {
                    publicVideo.miniature = myConst.WEB_MINIATURE + myConst.DEFAULT_MINIATURE;
                }
			});
            ejs.renderFile(_ViewDir + 'public-home.ejs', content, {}, function(err, fileContent) {
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

exports.getVideoPage = function(callback){
	getVideoPlayerSliderContent(function(err, content){
		if(err)
			callback(err,null);
		else {
			htmlContent.prototype.addCss([
				{url : myConst.WEB_CSS+"video.css"}
			]);
            content.html = htmlContent;
            ejs.renderFile(_ViewDir + 'videoView.ejs', content, {}, function(err, fileContent) {
                if(err){
                    callback(err,null);
                }
                else{
                    callback(null,fileContent);
                }
            })
		}
	});
};

var getContentVideoPageById = function(req,res,id,callback){
	var content = {
		video : {
			video_to_play : {},
			slider : {
								titre : "D'autres vidéos au hasard",
								videos : [],
								link : "#"
							},
			sliderDirect : {
				titre : "Aucun direct associé",
				videos : [],
				link : "#"
			}
		},
		html : req.HtmlToRender
	}
    content.html.prototype.addInternalJs([
        {src : myConst.WEB_JS+"video-general.js"},
    ]);
	Video.getVideoById(idVideo,function(err,result){
		if(err){
			res.status(500).send(err.stack);
		}else{
			if(!result[0]){
				req.flash('info','La vidéo demandée n\'existe pas.')
				res.redirect('/')
			}
			else{
				Video.getEncodedById(idVideo,function(err,encodages){
					if(err){
						res.status(500).send("error : " + err);
					}else{
						content.encodages = []
						var video_to_play=result[0];
						for(var i=0;i!=encodages.length;i++){
							if(encodages[i].type=="video/mp4"){
								var encode = {
									url : myConst.WEB_VIDEO + "encode_tmp/" + encodages[i].label + "/" + video_to_play.nom_video + ".mp4",
									type : encodages[i].type,
									name : encodages[i].label,
									value : encodages[i].label.substr(0,encodages[i].label.length-1)
								}
								content.encodages.push(encode)
							}
						}
						content.encodages.push({
								url : myConst.WEB_VIDEO + video_to_play.nom_video + ".mp4",
								type : "video/mp4",
								name : "Original",
								value : "720"})
						video_to_play.poster = myConst.WEB_MINIATURE + video_to_play.nom_image;
						video_to_play.date = db.toStandardDate(video_to_play.date);
						video_to_play.tag = db.toHashtagsTags(video_to_play.tag);
						content.video.video_to_play = video_to_play;
						randomList = [];
						for(var i=0;i!=20;i++){
							randomList.push(Math.floor(Math.random()*1800));
						}
						Video.getVideoListByIds(randomList,function(err,results){
							if(err)
								callback(err,null);
							else{
								for(var i = 0; i!=results.length; i++){
									var video = results[i];
									video.date = new Date(video.date);
									video.date = video.date.getFullYear()
									video.link = "/video/" + video.id;
									if(video.nom_image === null)
										video.poster = myConst.DEFAULT_MINIATURE;
									else{
										video.poster = myConst.WEB_MINIATURE + video.nom_image;
                    video.gif = myConst.WEB_GIF + video.nom_image.substr(0, video.nom_image.lastIndexOf(".")) + ".gif";
                  }
									content.video.slider.videos.push(video);
								}
								Direct.getDirectVideosListByVideoId(video_to_play.id,function(err,videosDirect){
									if(err)
										callback(err,null);
									else{
										for(var i = 0; i!=videosDirect.length; i++){
											var video = videosDirect[i];
											video.date = new Date(video.date);
											video.date = video.date.getFullYear()
											video.link = "/video/" + video.id_video;
											if(video.nom_image === null)
												video.poster = myConst.DEFAULT_MINIATURE;
											else{
												video.poster = myConst.WEB_MINIATURE + video.nom_image;
                        video.gif = myConst.WEB_GIF + video.nom_image.substr(0, video.nom_image.lastIndexOf(".")) + ".gif";
                      }
											content.video.sliderDirect.videos.push(video);
											content.video.sliderDirect.titre = video.nom
											content.video.sliderDirect.link = "/direct/" + video.id_direct
										}
										callback(null,content);
									}
								})
							}
						});
					}
				});
			}
		}
	});
}

exports.getVideoPageById = function(req,res,next){
	if(req.params.id){
		idVideo=req.params.id;
		if(!isNaN(idVideo)){
			getContentVideoPageById(req,res,idVideo,function(err,content){
				if(err)
					res.status(500).send(err);
				else{
					if(!content){
						req.flash('info','Aucune vidéo trouvée')
						req.redirect('/')
					}else{
							content.html.prototype.addInternalJs([{src : myConst.WEB_JS + "videojs-resolution-switcher.js"}])
							ejs.renderFile(myConst.VIEW_DIR + 'watchVideo.ejs', content, {}, function(err, fileContent){
								if(err)
									res.status(500).send("error : " + err);
								else{
                                    Video.updateVideoView(idVideo);
									res.send(fileContent);
								}
							});
					}
				}
			})
		}
		else {
			req.flash('info','Paramètre incorrect.')
			res.redirect('/');
		}
	}else{
		req.flash('info','Paramètre non fourni.')
		res.redirect('/');
	}
}

exports.getPageAccueil = function(req,res,callback){
	var content = {
		video : {
			video_main : {},
			videos_moment : [],
			slider : {
								titre : "Nos dernières videos",
								videos : [],
								link : "#"
							}
		},
		html : req.HtmlToRender
	}
	Video.getNLatestVideos(20,function(err,results){
		if(err){
			callback(err,null)
		}else{
			for(var i = 0; i!=results.length; i++){
				if(results[i].nom_image === null)
					results[i].poster = myConst.DEFAULT_MINIATURE;
				else
					results[i].poster = myConst.WEB_MINIATURE + results[i].nom_image;
				results[i].link = "/video/" + results[i].id;
				results[i].date = db.toStandardDate(results[i].newDate);
				content.video.slider.videos.push(results[i]);
			}
			Video.getNMostTrendyVideos(5,function(err,results){
				var video_main = results[0];
				if(results[0].nom_image === null) {
                    video_main.poster = myConst.DEFAULT_MINIATURE;
                }
				else {
				    video_main.poster = myConst.WEB_MINIATURE + results[0].nom_image;
				}
				video_main.link = "/video/" + results[0].id;
                video_main.date = db.toStandardDate(results[0].newDate);
				content.video.video_main = video_main
				for(var i = 1; i!=results.length; i++){
					var videos_moment = results[i];
					if(results[i].nom_image === null) {
                        videos_moment.poster = myConst.DEFAULT_MINIATURE;
                    }
					else {
                        videos_moment.poster = myConst.WEB_MINIATURE + results[i].nom_image;
                    }
					videos_moment.link = "/video/" + results[i].id;
					videos_moment.date = db.toStandardDate(results[i].newDate);
					content.video.videos_moment.push(videos_moment);
				}
				ejs.renderFile(myConst.VIEW_DIR + 'accueilView.ejs', content, {}, function(err, fileContent){
					if(err)
						res.status(500).send(err.stack);
					else{
						res.status(200).send(fileContent);
					}
				});
			})
		}
	});
}

exports.insertVideo = function(req, res, callback){
	Video.insertVideo(req.dataVideo.titre,req.dataVideo.tag,req.dataVideo.nom_video,
		req.dataVideo.description,req.dataVideo.date,req.dataVideo.is_diff,req.dataVideo.is_private,
		req.session.user.id,0,req.dataVideo.time_pict,req.dataVideo.id_image, callback)

}
