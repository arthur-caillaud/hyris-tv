var db = require('../db_management/db');
var exports = module.exports = {};

exports.getAllTags = function (callback) {
    var sqlQuery = "SELECT * FROM Tag";
    var inserts = [];
    db.formatedQuery(sqlQuery,inserts,function (err,res,fields) {
        if (err)
        {
            callback(err,null)
        }
        else
        {
            tag = []
            for(var i=0;i!=res.length;i++){
                tag.push(res[i].tag)
            }
            callback(null,tag)
        }
    })
};

exports.getAllTagsWithNbVideo = function (callback){
    var sqlQuery = "SELECT Tag.tag, count(Tag.tag) AS nb_video FROM Tag " +
        "LEFT JOIN Video ON Video.tag LIKE CONCAT('%,',Tag.tag) OR Video.tag LIKE CONCAT(Tag.tag,',%') " +
        "OR Video.tag LIKE CONCAT('%,',Tag.tag,',%') OR Video.tag LIKE Tag.tag GROUP BY Tag.tag"
    var inserts = [];
    db.formatedQuery(sqlQuery,inserts,function (err,res,fields) {
        if (err)
        {
            callback(err,null)
        }
        else
        {
            callback(null,res)
        }
    })
};

exports.getVideosByTag = function (tag,callback) {
    var sqlQuery = "SELECT *,Image.id AS id_image,DATE_FORMAT(Video.date,'%Y-%m-%d ') AS 'newDate' FROM Video " +
        "INNER JOIN Direct_video ON Direct_video.id_video = Video.id INNER JOIN Image ON Video.id_image = Image.id " +
        "WHERE Video.tag LIKE CONCAT('%,',?,'%') OR Video.tag LIKE CONCAT('%',?,',%') OR Video.tag LIKE ? ORDER BY newDate DESC";
    var inserts = [tag,tag,tag];
    db.formatedQuery(sqlQuery,inserts,function (err,res,fields) {
        if (err){
            callback(err,null)
        }
        else {
            callback(null,res)
        }
    })
};
