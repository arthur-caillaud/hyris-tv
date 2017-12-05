/**
 * Created by Arthur on 15/03/2017.
 */

var db = require('../db_management/db');
var mysql = require('mysql');
var exports = module.exports = {};

function Role(label, description, id){

    this.label = label;
    this.description = description;
    this.id = id;

}

exports.addRole = function (label,description,callback) {
    var sqlQuery = "INSERT INTO ?? SET ?";
    var role = {label : label, description : description};
    var inserts = ["Role",role];
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
}

exports.addUserRole = function (newRoleId,id_User,callback) {
    var sqlQuery = "INSERT INTO ?? SET ?"
        //"UPDATE ?? SET ?? = ? WHERE ?? = ?";
    var user_role = {id_role : newRoleId, id_user : id_User};
    var inserts = ["Role_user",user_role];
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
}
exports.deleteRoleUser = function(role_id, callback) {
    var sqlQuery = "DELETE FROM ?? WHERE ?? = ?";
    var inserts = ["Role_user", "id_role" , role_id];
    db.formatedQuery(sqlQuery, inserts, function (err,res,fields) {
        if (err) {
            callback(err,null)
        }
        else {
            callback(null, res)
        }
    })
}

exports.deleteRoleDroit = function(role_id, callback) {
    var sqlQuery = "DELETE FROM ?? WHERE ??=?";
    var inserts = ["Droir_role", "id_role", role_id];
    db.FormatedQuery(sqlQuery, inserts, function(err,res,fields) {
        if (err) {
            callback(err,null)
        }
        else {
            callback(null, res)
        }
    })
}

// Pour supprimer un role de la table role, il faut d'bord supprimer toutes les entrées ou les users ont ce role (cf deleteRoleUser & deleteRoleDroit)
exports.deleteRole = function (role_id,callback) {
    var sqlQuery = "DELETE FROM ?? WHERE ?? = ?";
    var inserts = ["Role","id",role_id];
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
}

exports.getUserRole = function (userLogin, callback) {
    var sqlQuery = "SELECT ?? FROM ?? INNER JOIN ?? ON ?? = ?? INNER JOIN ?? ON ?? = ?? WHERE ?? = ?";
    var inserts = ["label","Role","Role_user","Role.id","Role_user.id_role","User","Role_user.id_user","User.id","login",userLogin];
    db.formatedQuery(sqlQuery,inserts, function (err,res,fields) {
        if (err)
        {
            callback(err,null);
        }
        else
        {
            callback(null,res);
        }
    })
}

exports.addRoleDroit = function(role_id, droit_id, callback) {
    var sqlQuery = "INSERT INTO ?? SET ?";
    var role_droit ={id_droit : droit_id, id_role : role_id };
    var inserts = ["Droit_role",  role_droit];
    db.formatedQuery(sqlQuery,inserts,function (err,res,fields){
        if (err){
            callback(err,null);
        }
        else {
            callback(null, res);
        }
    })
}

exports.getRole = function(callback) {
    var sqlQuery = "SELECT label FROM Role";
    var inserts = [];
    db.formatedQuery(sqlQuery,inserts,function (err,res,fields){
        if (err){
            callback(err,null);
        }
        else {
            callback(null, res);
        }
    })
}

exports.getRights = function(callback) {
    var sqlQuery = "SELECT description FROM Droit";
    var inserts = [];
    db.formatedQuery(sqlQuery,inserts,function (err,res,fields){
        if (err){
            callback(err,null);
        }
        else {
            callback(null, res);
        }
    })
}

exports.getMembersRights = function(id_role, callback) {
    var sqlQuery = "SELECT * FROM User LEFT JOIN Role_user ON Role_user.id_user = User.id LEFT JOIN Role ON Role_user.id_role = Role.id WHERE label = ? ORDER BY Role_user.id_role DESC";
    var inserts = [id_role];
    db.formatedQuery(sqlQuery,inserts,function (err,res,fields){
        if (err){
            callback(err,null);
        }
        else {
            callback(null, res);
        }
    })
}