var ejs = require('ejs');
var my_const = require('../configure/myConst');

var htmlContent = require('../models/Html');

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

exports.getAdminPage = function(callback){
	// charge les modules d'administration

	content = {html : htmlContent};

	ejs.renderFile(my_const.VIEW_DIR + 'adminView.ejs',content,{},function(err, fileContent) {
                if(err){
                    callback(err,null);
                }
                else{
                    callback(null,fileContent);
                }
            })
};
