var ejs = require('ejs');
var fs = require('fs');
var my_const = require('../configure/myConst');

var htmlContent = require('../models/Html');

var _ViewDir = my_const.ROOT+"views/" + "adminSectionViews/";


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

exports.getManageMailingListPage = function(callback){

    content = {html : htmlContent};

    ejs.renderFile(_ViewDir + 'manageMailingListView.ejs',content,{},function(err, fileContent) {
        if(err){
            callback(err,null);
        }
        else{
            callback(null,fileContent);
        }
    })
};
