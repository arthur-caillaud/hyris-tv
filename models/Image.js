/**
 * Created by Alexandre on 25/04/2017.
 */
var db = require('../db_management/db');
var mysql = require('mysql');
var exports = module.exports = {};

function Image(titre, date, id) {

    this.titre = titre;
    this.date = date;
    this.id = id;
}

exports.addNewImage = function (nom_image, date, callback) {
    sqlQuery = "INSERT INTO ?? SET ?";
    image = {nom_image : nom_image, date : date};
    inserts = ["Image",image];
    db.formatedQuery(sqlQuery, inserts, function (err, res) {
        if (err){
            callback(err,null);
        }
        else {
            callback(null, res);
        }
    })
};

exports.updateImageByIdDirect = function (id, nouv_nom, callback) {
    sqlQuery = "UPDATE Image,Direct SET nom_image = ? WHERE Direct.id = ? AND Image.id = Direct.id_image";
    inserts = [nouv_nom,id];
    db.formatedQuery(sqlQuery, inserts, function (err, res) {
        if (err){
            callback(err,null);
        }
        else {
            callback(null, res);
        }
    })
};

exports.getImageById = function (id,callback){
    var sqlQuery = "SELECT * FROM ?? WHERE ?? == (?)";
    var inserts = ["Image","id",id];
    db.formatedQuery(sqlQuery,inserts, function (error,results){
        if (error)
            callback(error,null);
        else
            callback(null,results);
    });
}
