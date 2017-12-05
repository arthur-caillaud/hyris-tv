/**
 * Created by Arthur on 22/03/2017.
 */

var db = require('../db_management/db');
var mysql = require('mysql');
var exports = module.exports = {};

function Vote(val, date, idUser, idVideo) {

    this.val = val;
    this.date = date;
    this.idUser = idUser;
    this.idVideo = idVideo;

}

exports.getVideoVote = function (idVideo, callback) {
    var sqlQuery = "SELECT * FROM ?? WHERE ?? = ?";
    var inserts = ["Vote","id_video",idVideo];
    db.formatedQuery(sqlQuery,inserts, function (error,results,fields){
        if (error)
            callback(error,null);
        else
            callback(null,results);
    });
}

exports.getUserVote = function (idUser, callback) {
    var sqlQuery = "SELECT * FROM ?? WHERE ?? = ?";
    var inserts = ["Vote","id_user",idUser];
    db.formatedQuery(sqlQuery,inserts, function (error,results,fields){
        if (error)
            callback(error,null);
        else
            callback(null,results);
    });
}

exports.submitVote = function (val, date, idUser, idVideo) {
    var sqlQuery = "INSERT INTO ?? SET ?"
    var vote = {
        val : val,
        date : date,
        id_user : idUser,
        id_video : idVideo
    }
    var inserts = ["Vote",vote]
    db.formatedQuery(sqlQuery,inserts,function (err, res) {
        if (err){
            callback(err,null)
        }
        else{
            callback(null,res)
        }
    })
}