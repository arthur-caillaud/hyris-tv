/**
 * Created by Arthur on 16/03/2017.
 */

var ejs = require('ejs');
var fs = require('fs');
var myConst = require('../configure/myConst');
var userModel = require('../models/User');
var roleModel = require('../models/Role')
var htmlContent = require('../models/Html');
var exports = module.exports = {};

exports.getRoleManagementPage = function(callback){

    content = {html : htmlContent}
    content.html.prototype.addCss([{url : myConst.WEB_CSS + "manageRights.css"}])

    ejs.renderFile(my_const.VIEW_DIR + 'roleView.ejs', content, {}, function(err, fileContent) {
        if(err){
            callback(err,null);
        }
        else{
            callback(null,fileContent);
        }
    });
}

exports.editRole = function (modification,idRole,label,description,callback) {
    if (modification == "add")
    {
        roleModel.addRole(label,description,function (err,res,fields) {
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
    if (modification == "delete")
    {
        roleModel.deleteRole(idRole,function (err,res,fields) {
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
}
