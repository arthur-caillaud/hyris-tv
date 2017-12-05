/**
 * Created by Arthur on 14/03/2017.
 */

var db = require('../db_management/db');
var mysql = require('mysql');
var exports = module.exports = {};

function User(id, login, surnom, is_myecs){

    this.id = id;
    this.login = login;
    this.surnom = surnom;
    this.is_myecs = is_myecs;

}

exports.findByLogin = function(login,callback){
    var sqlQuery = "SELECT * FROM ?? WHERE ?? = ?";
    var inserts = ["User","login",login];
    db.formatedQuery(sqlQuery,inserts, function (error,results,fields){
        if (error)
            callback(error,null);
        else
            callback(null,results[0]);
    });
}

exports.LDAPauthECS = function (userLogin, mdp, callback) {
    var sqlQuery = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?";
    var inserts = ["User","login",userLogin,"mdp",mdp];
    db.formatedQuery(sqlQuery,inserts, function (error,results,fields){
        if (error)
            callback(error,null);
        else
            callback(null,results[0]);
    });
}

exports.addUser = function (login, surnom, mdp, is_myecs, callback) {
    var sqlQuery = "INSERT INTO ?? SET ?"
    var user = {
        login : login,
        surnom : surnom,
        mdp : mdp,
        is_myecs : is_myecs
    }
    var inserts = ["User",user]
    db.formatedQuery(sqlQuery,inserts,function (err, res) {
        if (err){
            callback(err,null)
        }
        else{
            callback(null,res)
        }
    })
}

exports.deleteUser = function (login , callback) {
    var sqlQuery = "DELETE FROM ?? WHERE ?? = ?"
    var inserts = ["User","login",login]
    db.formatedQuery(sqlQuery,inserts,function (err,res) {
        if (err){
            callback(err,null)
        }
        else {
            callback(null,res)
        }
    })
}
