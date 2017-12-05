var ejs = require('ejs');
var fs = require('fs');
var myConst = require('../configure/myConst');
var htmlContent = require('../models/Html');
var Role = require('../models/Role.js');
var _ViewDir = myConst.ROOT+"views/" + "adminSectionViews/";


/*
 var content = {
 html : htmlContent,
 panelSection : {
 [ section : {
 titre : str,
 lien : str
 ]
 }
 };
 */


var exports = module.exports = {};

function generateLeftSide (rightContent, roleList, callback){

    var roles
    var content = {
        html : htmlContent,
        roles : roleList,
        rightContent : rightContent
    };
    content.html.prototype.addCss([{url : myConst.WEB_CSS + "manageRights.css"}]);

    ejs.renderFile(_ViewDir + 'manageRightsView.ejs',content,{},function(err, fileContent) {
        if(err){
            callback(err,null);
        }
        else{
            callback(null,fileContent);
        }
    })
}

function generateRightSide (page, roleList, contentList, callback){

    var content = { contentListArray:contentList }
    ejs.renderFile(_ViewDir + page + 'List.ejs',content,{},function(err, rightContent) {
        if(err){
            callback(err,null);
        }
        else{
            generateLeftSide(rightContent, roleList, function(err,res){
                if(err){
                    callback(err,null);
                }
                else{
                    callback(null,res);
                }
            })
        }
    })
}

exports.getManageRightsPage = function(req, res, callback){

    var role = req.query.role;
    var page = req.query.page;
        if ( page == 'members' ) {
            Role.getMembersRights(role, function(err, contentList) {
                if (err) {
                    callback(err, null);
                }
                else {
                    Role.getRole(function (err, roleList) {
                        if (err) {
                            callback(err, null);
                        }
                        else {
                            generateRightSide(page, roleList, contentList, function (err, rightContent) {
                                if (err) {
                                    callback(err, null);
                                }
                                else {
                                    callback(null, rightContent);
                                }
                            })
                        }
                    })
                }
            })
        }
        else if ( page == 'rights' ) {
            Role.getRights(function (err, contentList) {
                //console.log(contentList[0].label);
                if (err) {
                    callback(err, null);
                }
                else {
                    Role.getRole(function (err, roleList) {
                        if (err) {
                            callback(err, null);
                        }
                        else {
                            generateRightSide(page, roleList, contentList, function (err, rightContent) {
                                if (err) {
                                    callback(err, null);
                                }
                                else {
                                    callback(null, rightContent);
                                }
                            })
                        }
                    })
                }
            })
        }

        else {
            Role.getRole(function (err, roleList) {
                if (err) {
                    callback(err, null);
                }
                else {
                    generateLeftSide("", roleList, function(err,res){
                        if(err){
                            callback(err,null);
                        }
                        else{
                            callback(null,res);
                        }
                    })
                }
            })
        }
    }
