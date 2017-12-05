/**
 * Created by Arthur on 16/03/2017.
 */

var db = require('../db_management/db');
var mysql = require('mysql');
var exports = module.exports = {};

function Droit(label, description, id) {

    this.label = label;
    this.description = description;
    this.id = id;

}

exports.getPrivilegeList = function (userId , callback) {
    sqlQuery = "SELECT * FROM ?? INNER JOIN  ?? INNER JOIN ?? ON ?? = ?? AND ?? = ?? WHERE ?? = ?"
    inserts = ["Droit","Droit_role","Role_user","Droit.id","Droit_role.id_droit","Droit_role.id_role","Role_user.id_role","Role_user.id_user",userId]
    db.formatedQuery(sqlQuery,inserts,function (error,results,fields) {
        if(error) {
            callback (error,null)
        }
        else {
            var privilegeList = []
            for (var i in results){
                privilegeList.push(results[i].label)
            }
            callback(null,privilegeList)
        }
    })
}

exports.getUserRight = function (userId, rightLabel , callback) {
    sqlQuery = "SELECT * FROM ?? INNER JOIN  ?? INNER JOIN ?? INNER JOIN ?? ON ?? = ?? AND ?? = ?? AND ?? = ?? WHERE ?? = ? AND ?? = ?"
    inserts = ["Droit","Droit_role","Role_user","User","Droit.id","Droit_role.id_droit","Droit_role.id_role","Role_user.id_role","Role_user.id_user","User.id","Role_user.id_user",userId,"Droit.label",rightLabel]
    db.formatedQuery(sqlQuery,inserts,function (error,results,fields) {
        if(error) {
            callback (error,null)
        }
        else {
            if (results.length) {
                callback(null, results[0].label)
            }
            else {
                callback(error,null)
            }
        }
    })
}