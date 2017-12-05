/**
 * Created by Arthur on 28/03/2017.
 */

var ejs = require('ejs');
var fs = require('fs');
var my_const = require('../configure/myConst');
var userModel = require('../models/User');
var roleModel = require('../models/Role');
var rightModel = require('../models/Droit')
var htmlContent = require('../models/Html');
var exports = module.exports = {};

/**
 Middleware permettant de vérifier si on est admin ou pas
 Prend en paramètre une chaîne de caractères et check si tu as les droits associés à la chaîne
 Faire un lien propre qui permet de récupérer
 **/

var isGrantedMiddleware = function (req,res,next) {
    var sess = req.session;
    if(!sess){
        res.status(500).send("Unable to get req.session");
    }else{
        if (sess.user){
            if (sess.user.role === "admin"){
                req.HtmlToRender.header.lateralMenu.isAdmin = true;
                req.HtmlToRender.isGranted.modifyDirect = true;
                req.HtmlToRender.isGranted.modifyVideo = true;
            }
            else {
                req.HtmlToRender.header.lateralMenu.isAdmin = false;
            }
        }
        var rootUrl=req.url.split('/')[1]
        if(rootUrl === 'admin'){
            if (sess.user){
                if (sess.user.role === "admin"){
                    next();
                }
                else {
                    req.flash('info','Vous n\'avez pas les droits pour accéder à cette partie du site.')
                    res.redirect('/')
                }
            }else {

                res.redirect('/auth')
            }
        }else{
            next();
        }
    }
}

module.exports=function isGranted(){
    return isGrantedMiddleware;
}
