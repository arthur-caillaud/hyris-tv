
/**
 * Created by Arthur on 28/02/2017.
 */

/*
Ne pas oublier les require de SQL...
Communiquer avec la BDD pour récupérer le JSON de la vidéo
Module soit accessible depuis videocontroller.js
 */

var db = require('../db_management/db');
var Direct = require('./Direct')
var mysql = require('mysql');
var exports = module.exports = {};
var Rx = require('rxjs');

var columnsImgVideo = "Video.id,Video.is_private,Video.time_pict,Video.date,Video.titre,Image.nom_image,nom_video, tag, description, nb_vue, active, DATE_FORMAT(Video.date,'%Y-%m-%d ') AS 'newDate'";

exports.insertVideo = function (titre,tag,nom_video,description,date,is_diff,is_private,id_user,score,time_pict,id_image,callback){
    var sqlQuery = "INSERT INTO ?? SET ? ";
    var video = {titre : titre, tag: tag, nom_video : nom_video, description :description, date : date, is_diff : is_diff, is_private : is_private, id_user : id_user, score : score, time_pict : time_pict, id_image : id_image}
    var inserts = ["Video",video];
    db.formatedQuery(sqlQuery, inserts, function(err,res) {
        if(err){
            callback(err,null)
        }
        else{
            callback(null,res)
        }
    });
};

exports.isPublic = function(idVideo){
    const queryObservable = Rx.Observable.create(obs => {
        const sqlQuery = "SELECT is_private FROM Video WHERE Video.id = ?";
        const inserts = [idVideo];
        db.formatedQuery(sqlQuery,inserts,(err,res) => {
            if(err){
                obs.onError(err);
            }
            else{
                obs.next(res);
            }
        })
    });
    return queryObservable;
};

exports.getPublicVideo = function(callback){
    const sqlQuery = "SELECT *,DATE_FORMAT(Video.date,'%Y-%m-%d ') AS 'newDate', Encode_video.is_encode AS is_miniatureencoded, Video.id AS id_video FROM Video JOIN Encode_video ON Video.id = Encode_video.id_video INNER JOIN Image ON Video.id_image = Image.id WHERE active = 1 AND Video.is_private = 1 AND Encode_video.id_encode = 5 ORDER BY Video.date DESC";
    const inserts = [];
    db.formatedQuery(sqlQuery,inserts, function (err,data) {
        if(err){
            callback(err,null)
        }
        else {
            callback(null,data)
        }
    })
}

exports.getAllEncodedById = function(id,callback){
    const sqlQuery = "SELECT * FROM Video JOIN Encode_video ON Video.id = Encode_video.id_video JOIN Encode ON Encode.id = Encode_video.id_encode WHERE Video.id = ? AND active = 1 ORDER BY label";
    const inserts = [id];
    db.formatedQuery(sqlQuery,inserts,function(err,res){
      if(err){
        callback(err,null)
      }else{
        callback(null,res)
      }
    })
}

exports.getEncodedById = function(id,callback){
    const sqlQuery = "SELECT * FROM Video JOIN Encode_video ON Video.id = Encode_video.id_video JOIN Encode ON Encode.id = Encode_video.id_encode WHERE Video.id = ? AND is_encode = 1 AND active = 1 ORDER BY label";
    const inserts = [id];
    db.formatedQuery(sqlQuery,inserts,function(err,res){
      if(err){
        callback(err,null)
      }else{
        callback(null,res)
      }
    })
}

exports.updateVideoById = function (id, titre, date, description, is_private, tag, time_pict, active, id_direct, callback){
  var sqlQuery = "UPDATE Video SET ? WHERE id = ? ";
  var video = {
      titre : titre,
      date : date,
      description : description,
      is_private : is_private,
      tag : tag,
      time_pict : time_pict,
      active : active
  };
  var inserts = [video,id];
  db.formatedQuery(sqlQuery,inserts,function(err,res){
    if(err){
      callback(err,null)
    }else{
        if(!isNaN(id_direct) && id_direct!=''){
            Direct.updateVideoDirectById(id,id_direct,function(err2,res2){
                if(err2){
                    callback(err2,null)
                }else{
                    callback(null,res2)
                }
            })
        }else{
            callback(null,res)
        }
    }
   })
};

exports.getVideoById = function (id,callback) {
    var sqlQuery = "SELECT "+columnsImgVideo+", Encode_video.is_encode AS is_miniatureencoded FROM Video LEFT JOIN Image ON Image.id = id_image JOIN Encode_video ON Video.id = Encode_video.id_video WHERE active = 1 AND Video.id = ? AND Encode_video.id_encode = 5";
    var inserts = [id];
	db.formatedQuery(sqlQuery,inserts, function (error,results){
        if (error)
			callback(error,null);
        else
			callback(null,results);
    });
};


exports.getVideoListByIds = function (idList,callback){
    var sqlQuery = "SELECT "+columnsImgVideo+", Encode_video.is_encode AS is_miniatureencoded FROM Video LEFT JOIN Image ON Image.id = id_image JOIN Encode_video ON Video.id = Encode_video.id_video WHERE Video.id IN (?) AND active = 1 AND Encode_video.id_encode = 5 ORDER BY Date DESC";
    var inserts = [idList];
    db.formatedQuery(sqlQuery,inserts, function (error,results){
        if (error)
			callback(error,null);
        else
			callback(null,results);
    });
};

exports.getVideoListByDirectId = function (directId, callback) {
    var sqlQuery = "SELECT *,DATE_FORMAT(Video.date,'%Y-%m-%d ') AS 'newDate', Encode_video.is_encode AS is_miniatureencoded FROM Video INNER JOIN Direct_video ON Direct_video.id_video = Video.id JOIN Encode_video ON Video.id = Encode_video.id_video INNER JOIN Image ON Video.id_image = Image.id WHERE active = 1 AND Direct_video.id_direct = ? AND Encode_video.id_encode = 5"
    var inserts = [directId];
    db.formatedQuery(sqlQuery,inserts, function (err,data) {
        if(err){
            callback(err,null)
        }
        else {
            callback(null,data)
        }
    })
};

exports.getNLatestVideos = function (n,callback) {
    var sqlQuery = "SELECT "+columnsImgVideo+", Encode_video.is_encode AS is_miniatureencoded FROM Video JOIN Encode_video ON Video.id = Encode_video.id_video LEFT JOIN Image ON Image.id = id_image WHERE active = 1 AND Encode_video.id_encode = 5 ORDER BY Video.date DESC LIMIT 0,?";
    var inserts = [n];
    db.formatedQuery(sqlQuery,inserts, function (error,results){
        if (error)
			callback(error,null);
        else
			callback(null,results);
    });
};

exports.getNMostTrendyVideos = function (n,callback) {
    var sqlQuery = "SELECT "+columnsImgVideo+", Encode_video.is_encode AS is_miniatureencoded, (score + 2-0.005*DATEDIFF(CURDATE(),Video.date)) AS scoreFin FROM Video JOIN Encode_video ON Video.id = Encode_video.id_video LEFT JOIN Image ON Image.id = id_image WHERE active = 1 AND Encode_video.id_encode = 5 ORDER BY scoreFin DESC LIMIT 0,?";
    var inserts = [n];
    db.formatedQuery(sqlQuery,inserts, function (error,results){
        if (error)
			callback(error,null);
        else
			callback(null,results);
    });
};

exports.getVideoBySearch = function(q,callback){
    /* need to be deleted */
    qSplit = q.split(" ");
    tagCoef = 4
    for(i=0;i!=qSplit.length;i++){
        if(qSplit[i].substr(0,1)=="#"){
            qSplit[i]=qSplit[i].substr(1)
            tagCoef = 20;
        }
    }
    q = qSplit.join(" ");
    /* */
    var sqlQuery = "SELECT A.titre,A.tag,A.description,A.date,A.id,A.relTitre,A.relDate,A.relDescr,A.relTag," +
        "(A.relTitre*8)+"+tagCoef+"*(A.relTag)+2*(A.relDate+SIGN(A.relDate)*A.relDate)+A.relDescr AS score " +
        "FROM (" +
        "SELECT DISTINCT titre,tag,description,date,id," +
        "MATCH (titre) AGAINST (?) AS relTitre," +
        "MATCH (tag) AGAINST (?) AS relTag," +
        "MATCH (description) AGAINST (?) AS relDescr," +
        "2-0.005*DATEDIFF(CURDATE(),Video.date) AS relDate " +
        "FROM Video WHERE active = 1 AND MATCH (titre,tag,description) AGAINST (?)) AS A " +
        "ORDER BY score DESC LIMIT 10";
    var inserts = [q,q,q,q];
    db.formatedQuery(sqlQuery,inserts, function (error,results){
        if (error)
			callback(error,null);
        else
			callback(null,results);
    });
};

exports.updateVideoView = function (id_video){
    var sqlQuery = "UPDATE Video SET nb_vue = nb_vue + 1 WHERE id = ?";
    var inserts = [id_video];
    db.formatedQuery(sqlQuery,inserts,function (err,res) {
        if (err){
            console.log(err)
        }
        else {
        }
    })
};


exports.getVideosByTagName = function (tagName,callback) {
    var sqlQuery = "SELECT "+columnsImgVideo+", Encode_video.is_encode AS is_miniatureencoded FROM Video JOIN Encode_video ON Video.id = Encode_video.id_video WHERE active = 1 AND tag = ? AND Encode_video.id_encode = 5";
    var inserts = [tagName];
    db.formatedQuery(sqlQuery,inserts, function (error,results){
        if (error)
			callback(error,null);
        else
			callback(null,results);
    });
};

exports.prototype = {};

exports.prototype.formatDate = function(video,type){
  if(video)
    if(video.date){
      if(type=="Y"){
        video.date = new Date(video.date);
        video.date = video.date.getFullYear();
      }
      if(type=="D/M/Y"){
        video.date = new Date(video.date);
        var d = String(video.date.getDate());
        var m = String(video.date.getMonth()+1);
        var y = video.date.getFullYear();

        if(d.length==1)
          d = "0" + d
        if(m.length==1)
          m = "0" + m

        video.date = d + "/" + m + "/" + y
      }
  }
};

/*query = "SELECT * FROM Video";
db.formatedQuery(query,[],(err,res) => {
    if(err){
        console.error(err.message);
    }
    if(res){
        res.forEach(video => {
            sqlQuery = "INSERT INTO Encode_video(id_video, is_encode, id_encode) VALUES (?, 0, 7)"
            inserts = [video.id];
            db.formatedQuery(sqlQuery,inserts,(err,res) => {
                if(err){
                    console.error(err.message);
                }
                if(res){
                    console.log(res);
                }
            })
        })
    }
});*/

/*
sqlQuery = "DELETE FROM Encode_video WHERE id_encode = 7"
inserts = [];
db.formatedQuery(sqlQuery,inserts,(err,res) => {
    if(err){
        console.error(err.message);
    }
    if(res){
        console.log(res);
    }
});*/