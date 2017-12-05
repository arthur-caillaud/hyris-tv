/**
 * Created by Alexandre on 25/04/2017.
 */

var fs = require('fs');
var my_const = require('../configure/myConst');
var htmlContent = require('../models/Html');
var image = require('../models/Image');
var exports = module.exports = {};

exports.uploadImage = function(req, res, nameImage, callback) {
    image.addNewImage(nameImage, req.body.date, function(err,result){
        if(err){
            res.status(500).send(err.stack);
        }
        else{
            req.flash('success','Image importée avec succès dans la base de donnée.');
            callback(result.insertId);
        }
    })
}


exports.createImgForVideo = function(req, res, callback) {
  image.addNewImage(req.imgData.titre,req.imgData.date, function(err,result){
    if(err){
      console.err('error createImgForVideo:' + err);
    }
    else{
      callback(result);
    }
  })

}
