var ejs = require('ejs');
var fs = require('fs');

var exports = module.exports = {};
var Tag = require('../models/Tag.js');
var myConst = require('../configure/myConst');
var htmlContent = require('../models/Html');
var db = require('../db_management/db');

exports.getAllTags_JSON = function(callback){
    Tag.getAllTags(function(err,tags){
        if(err){
            res.status(500).send(err.stack)
        }
        else{
            res.send(null,JSON.stringify(tags));
        }
    });
};

exports.getTagPage = function (req,res,callback) {
    tagName = req.params.tag;
    if (tagName){
        Tag.getVideosByTag(tagName, function (err, videosData) {
            if (err) {
                callback(err,null)
            }
            else {
                content = {html: htmlContent};
                content.tagName = tagName;
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
                content.tagVideos = videosData;
                ejs.renderFile(myConst.VIEW_DIR + 'tagView.ejs', content, {}, function (err, fileContent) {
                    if (err) {
                        callback(err,null)
                    }
                    else {
                        callback(null,fileContent)
                    }
                })
            }
        })
    }
    else {
        req.flash('info',"Aucun tag fourni");
        res.redirect('/');
    }

};

exports.getTagCloud = function(req,res,callback) {
    content = {html : htmlContent};
    Tag.getAllTagsWithNbVideo(function (err,tagData) {
        if (err){
            callback(err,null)
        }
        else {
            content.jqcloud = {};
            content.jqcloud.tagData = [];
            tagData.forEach(function (tag) {
                content.jqcloud.tagData.push(tag);
            })
            ejs.renderFile(myConst.VIEW_DIR + "tagCloud.ejs", content, {}, function (err,fileContent) {
                if (err) {
                    callback(err,null)
                }
                else {
                    callback(null,fileContent)
                }
            })
        }
    })
};
