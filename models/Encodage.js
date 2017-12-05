const db = require('../db_management/db');
const Video = require('./Video');
const mysql = require('mysql');
const Rx = require('rxjs');

exports = module.exports = {};

exports.getAllUnencodedGif = function(){
    return Rx.Observable.create(obs => {
        let sqlQuery = "SELECT *, Encode_video.id AS id_encodevideo FROM Encode_video JOIN Encode ON Encode.id = Encode_video.id_encode " +
            "JOIN Video ON Encode_video.id_video = Video.id WHERE Encode_video.label = 'gif' ORDER BY Encode_video.date DESC";
        let inserts = [];
        db.formatedQuery(sqlQuery,inserts, function (err,res) {
            if(res){
                obs.onNext(res);
            }
            if(err){
                obs.onError(err);
            }
        })
    })
};

exports.getAllUnencodedMiniatures = function(){
    return Rx.Observable.create(obs => {
        let sqlQuery = "SELECT *, Encode_video.id AS id_encodevideo FROM Encode_video JOIN Encode ON Encode.id = Encode_video.id_encode " +
            "JOIN Video ON Encode_video.id_video = Video.id WHERE Encode_video.is_encode = 0 " +
            "AND (Encode_video.id_encode = 5 OR Encode_video.id_encode = 6)";
        let inserts = [];
        db.formatedQuery(sqlQuery,inserts, function (err,res) {
            if(res){
                obs.onNext(res);
            }
            if(err){
                obs.onError(err);
            }
        })
    })
};

exports.getAllUnencodedVideos = function(){
    //WARNING - USING RXJS OBSERVABLES
    return Rx.Observable.create(obs => {
        let sqlQuery = "SELECT *, Encode_video.id AS id_encodevideo FROM Encode_video JOIN Encode ON Encode.id = Encode_video.id_encode " +
            "JOIN Video ON Encode_video.id_video = Video.id WHERE Encode_video.is_encode = 0 AND Encode_video.id_encode < 5 ORDER BY Encode_video.id_encode = 2 DESC, Video.date DESC";
        let inserts = [];
        db.formatedQuery(sqlQuery,inserts, function (err,res) {
            if(res){
                obs.onNext(res);
            }
            if(err){
                obs.onError(err);
            }
        })
    });
};

exports.getAllUnencodedVideos().subscribe({
    next: res => {
        console.log("Still " + res.length + " videos no encoded.");
    }
})

exports.getListEncodage = function(callback){
    let sqlQuery = "SELECT * FROM Encode";
    let inserts = [];
    db.formatedQuery(sqlQuery,inserts, function (error,results){
        if (error)
            callback(error,null);
        else
            callback(null,results);
    });
};

exports.setListEncodageToVideo = function (listIdEncodage,idVideo,callback) {
    let sqlQuery = "DELETE FROM Encode_video WHERE ?? = ?";
    let inserts = [{"id_video" : idVideo}];
    db.formatedQuery(sqlQuery,inserts,function (err,res,fields) {
        let sqlQuery = "INSERT INTO Encode_video SET ?";
        let i=0;
        listIdEncodage.forEach(function(idEncode){
            let encodeEntry = {id_encode : idEncode, id_video : idVideo};
            let inserts = [encodeEntry];
            db.formatedQuery(sqlQuery,inserts,function (err,res,fields) {
                if (err){
                    callback(err,null);
                }
                else{
                    i+=1;
                    if(i==listIdEncodage.length){
                         callback(null,res)
                    }
                }
            })
        })
    })
};

exports.updateListEncodage = function(req,id_video,newList,callback){
    Video.getAllEncodedById(id_video,function(err,oldList){
        if (err)
            callback(err,null);
        else{
            let exist_already
            if(newList!=undefined){
                for(let j=0;j!=newList.length;j++){
                    exist_already = false
                    for(let i=0;i!=oldList.length;i++){
                        if(newList[j] == oldList[i].id_encode){
                            exist_already = true
                            break
                        }
                    }
                    if(!exist_already){
                        let sqlQuery = "INSERT INTO Encode_video SET ?";
                        let encodeEntry = {id_encode : newList[j], id_video : id_video};
                        db.formatedQuery(sqlQuery,encodeEntry,function (err,res,fields) {
                            if (err){
                                req.flash("error","Error while adding encoding." + err)
                            }else{
                                req.flash("success","Encoding added with success.")
                            }
                        })
                    }
                }
            }
            // let's callback directly to avoid complex event handling, all error/success will be flashed
            callback(null,{state:"success"})
        }
    })
}
