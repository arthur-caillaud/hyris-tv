/**
 * Created by Arthur on 22/03/2017.
 */

var ejs = require('ejs');
var fs = require('fs');
var my_const = require('../configure/myConst');
var voteModel = require('../models/Vote');
var userModel = require('../models/User');
var roleModel = require('../models/Role');
var rightModel = require('../models/Droit')
var htmlContent = require('../models/Html');
var exports = module.exports = {};


exports.getVoteBlock = function(idVideo, callback){
    voteModel.getVideoVote(idVideo, function(err, res) {
        if (err) {
            callback(err, null)
        }

        else {
            var data = {vote : {}}
            data.vote.like = 0;

            for (var parcours in res) {
                data.vote.like += parcours.val;
            }
            data.vote.dislike = res.length - data.vote.like;

            ejs.renderFile(my_const.VIEW_DIR + 'video_block/vote_block.ejs', data, {}, function(err, fileContent) {
                if(err){
                    callback(err,null);
                }
                else{
                    callback(null,fileContent);
                }
            });
        }
    })
}
