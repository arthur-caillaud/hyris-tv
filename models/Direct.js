/**
 * Created by Arthur on 16/03/2017.
 */

var db = require('../db_management/db');
var mysql = require('mysql');
var exports = module.exports = {};

function Direct(label, description, date, id_image, id) {

    this.label = label;
    this.description = description;
    this.date = date;
    this.id_image = id_image;
    this.id = id;
}

exports.getLastDirects = function (callback) {
    sqlQuery = "SELECT * FROM ?? ORDER BY ?? DESC LIMIT 5";
    inserts = ["Direct","date"];
    db.formatedQuery(sqlQuery,inserts, function (err,data) {
        if (err){
            callback(err,null)
        }
        else {
            callback(null,data)
        }
    })
};


exports.getDirectById = function (id,callback) {
    sqlQuery = "SELECT *, Direct.id as id_direct, DATE_FORMAT(Direct.date,'%Y-%m-%d') AS 'newDate', nom_image FROM Direct LEFT JOIN Image ON Image.id = Direct.id_image WHERE Direct.id = ?";
    inserts = [id];
    db.formatedQuery(sqlQuery,inserts, function(error,results){
        if (error)
            callback(error,null);
        else
            callback(null,results);
    });

};

exports.getDirectByName = function(name,callback) {
    var sqlQuery = "SELECT * FROM ?? WHERE  ??=?";
    var inserts = ["Direct","nom",name];
    db.formatQuery(sqlQuery,inserts, function(error,results){
        if (error)
            callback(error,null);
        else
            callback(null,results);
    });
};

exports.getDirectByDescription = function(description,callback) {
    var sqlQuery = "SELECT * FROM ?? WHERE ??=?";
    var inserts = ["Direct","description",description];
    db.formatQuery(sqlQuery,inserts, function(error,results){
        if (error)
            callback(error,null);
        else
            callback(null,results);
    });
};

exports.getVideosListByDirectId = function(id,callback) {
    var sqlQuery = "SELECT ??,??,??,?? FROM ?? JOIN ?? ON ?? = ?? JOIN ?? ON ?? = ?? JOIN ?? ON ?? = ?? WHERE ?? = ? AND active = 1";
    var inserts = ["id_video","nom_video","nom","nom_image","Direct","Direct_video","Direct.id","Direct_video.id_direct","Video","Video.id","Direct_video.id_video","Image","Image.id","Video.id_image","Direct.id",id];
    db.formatedQuery(sqlQuery,inserts, function(error,results){
        if (error)
            callback(error,null);
        else
            callback(null,results);
    });

};

exports.getDirectVideosListByVideoId = function(id,callback) {
    var sqlQuery = "SELECT * FROM Video JOIN Image ON Image.id = Video.id_image JOIN Direct_video ON Direct_video.id_video = Video.id JOIN Direct ON Direct_video.id_direct = Direct.id WHERE active = 1 AND Direct.id IN( SELECT Direct_video.id_direct FROM Direct_video INNER JOIN Video ON Video.id = Direct_video.id_video WHERE Video.id = ?)";
    var inserts = [id];
    db.formatedQuery(sqlQuery,inserts, function(error,results){
        if (error)
            callback(error,null);
        else
            callback(null,results);
    });

};

exports.addNewDirect = function (nom, description, date, id_image, callback) {
    sqlQuery = "INSERT INTO ?? SET ?";
    direct = {nom : nom, description : description, date : date, id_image : id_image};
    inserts = ["Direct",direct];
    db.formatedQuery(sqlQuery, inserts, function (err, res) {
        if (err){
            callback(err,null);
        }
        else {
            callback(null,res);
        }
    })
};

exports.updateDirect = function(nom, description, date, idDirect, callback){
    sqlQuery = "UPDATE Direct SET nom = ?, description = ?, date = ? WHERE id = ?";
    inserts = [nom, description, date, idDirect];
    db.formatedQuery(sqlQuery, inserts, function (err, res) {
        if (err){
            callback(err,null);
        }
        else {
            callback(null,res);
        }
    })
};

exports.addVideoToDirect = function(id_video, id_direct, callback){
    sqlQuery = "INSERT INTO Direct_video SET ?";
    direct_video = {id_video : id_video, id_direct : id_direct};
    inserts = [direct_video];
    db.formatedQuery(sqlQuery, inserts, function (err, res) {
        if (err){
            callback(err,null);
        }
        else {
            callback(null,res);
        }
    })
}

exports.updateVideoDirectById = function(id_video, new_direct_id, callback){
    sqlQuery = "UPDATE Direct_video SET ? WHERE id_video = ?";
    direct_video = {id_direct : new_direct_id};
    inserts = [direct_video, id_video];
    db.formatedQuery(sqlQuery, inserts, function (err, res) {
        if (err){
            callback(err,null);
        }
        else {
            callback(null,res);
        }
    })
};

exports.getDirectRootViewData = function (callback) {
    sqlQuery = "SELECT nom,description,Direct.id, DATE_FORMAT(Direct.date,'%Y-%m-%d ') AS 'newDate', nom_image " +
        "FROM Direct INNER JOIN Image ON Image.id = Direct.id_image ORDER BY Direct.date DESC";
    inserts = [];
    db.formatedQuery(sqlQuery,inserts, function (err,data) {
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, data)
        }
    })
};

exports.getDirectNameById = function(id, callback) {
    var sqlQuery = "SELECT * FROM ?? WHERE ?? = ?"
    var inserts = ["Direct", "Direct.id",id];
    db.formatedQuery(sqlQuery,INserts, function(error,results){
        if (error)
            callback(error,null);
        else
            callback(null,results);
    })
};

exports.getDirectNameAndImageById = function(id, callback) {
    var sqlQuery = "SELECT ??,?? FROM ?? LEFT JOIN ?? ON ?? = ?? WHERE ?? = ?"
    var inserts = ["Direct.nom","Image.nom_image","Direct","Image","Image.id","Direct.id_image","Direct.id",id];
    db.formatedQuery(sqlQuery,inserts, function(error,results){
       if (error)
           callback(error,null);
        else
            callback(null,results);
    });
};



exports.getListDirectByQuery = function(query, callback) {
    var sqlQuery = "SELECT * FROM ?? WHERE ?? LIKE ? OR ?? LIKE ?"
    var inserts = ["Direct","nom",query,"description",query];
    db.formatedQuery(sqlQuery, inserts, function(error,results){
       if (error)
           callback(error,null);
        else
            callback(null,results);
    });
};


exports.getListIdDirectByQuery = function(query,callback){
    var sqlQuery = "SELECT DISTINCT *, MATCH (nom) AGAINST (?) AS reldirectname, MATCH (tag) AGAINST (?) AS reldirecttag, MATCH (description) AGAINST (?) AS reldirectdesc FROM Direct WHERE MATCH (nom,tag,description) AGAINST (?) ORDER BY (reldirectname*3)+(reldirecttag*2)+(reldirectdesc) DESC";
    var inserts = [query,query,query,query];
    db.formatedQuery(sqlQuery,inserts, function(error,results){
        if (error)
            callback(error,null);
        else
            callback(null,results);
    });
};

exports.getDirectBySearch = function(q,callback){
    var sqlQuery = "SELECT A.nom,A.description,A.date,A.id,A.relTitre,A.relDate,A.relDescr," +
        "(A.relTitre*13)+4*(A.relDate+SIGN(A.relDate)*A.relDate)+A.relDescr AS score " +
        "FROM (" +
        "SELECT DISTINCT nom,description,date,id," +
        "MATCH (nom) AGAINST (?) AS relTitre," +
        "MATCH (description) AGAINST (?) AS relDescr," +
        "2-0.005*DATEDIFF(CURDATE(),Direct.date) AS relDate " +
        "FROM Direct WHERE MATCH (nom,description) AGAINST (?)) AS A " +
        "ORDER BY score DESC LIMIT 10";
    var inserts = [q,q,q];
    db.formatedQuery(sqlQuery,inserts, function (error,results){
        if (error)
            callback(error,null);
        else
            callback(null,results);
    });
};
