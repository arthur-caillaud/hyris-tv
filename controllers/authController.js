var ejs = require('ejs');
var fs = require('fs');
var my_const = require('../configure/myConst');
var userModel = require('../models/User');
var roleModel = require('../models/Role');
var rightModel = require('../models/Droit')
var htmlContent = require('../models/Html');
var exports = module.exports = {};

exports.callbackLoginMySQL = function(req,res){
    sess = req.session;
    sess.auth = true;
    sess.user = {}
    sess.user=req.user;
    if(sess.redirectUrl){
        res.redirect(sess.redirectUrl);
        sess.redirectUrl = "";
    }
    else
        res.redirect('/');
}

exports.callbackLoginLDAP = function(req,res){
    sess = req.session;
    sess.auth = true;
    sess.user = {}
    sess.user.login=req.user.cn;
    if(sess.redirectUrl){
        res.redirect(sess.redirectUrl);
        sess.redirectUrl = "";
    }
    else
        res.redirect('/');
}

exports.callbackLoginOAuth2 = function(req,res){
    var sess = req.session;
    sess.auth = true;
    sess.user = req.user
    userModel.findByLogin(sess.user.login,function(err2,user_bdd){
        if(err2){
            res.status(500).send(err2)
        }else{
            if(user_bdd === undefined){
                userModel.addUser(sess.user.login,'','',1,function(err3,user_created){
                    sess.user.id = user_created.insertId
                    if(sess.redirectUrl){
                        res.redirect(sess.redirectUrl);
                        sess.redirectUrl = "";
                    }
                    else
                        res.redirect('/');
                })
            }else{
                sess.user.id = user_bdd.id
                sess.user.surnom = user_bdd.surnom
                if(sess.redirectUrl){
                    res.redirect(sess.redirectUrl);
                    sess.redirectUrl = "";
                }
                else
                    res.redirect('/');
            }
        }
    })
}

exports.getAuthPage = function(callback){
        var content = {html : htmlContent}
        ejs.renderFile(my_const.VIEW_DIR + 'authView.ejs', content, {}, function(err, fileContent) {
            if(err){
                callback(err,null);
            }
            else{
                callback(null,fileContent);
            }
        });
}

exports.loginUser = function (login, password, callback) {
    userModel.LDAPauthECS(login,password,function (err,res) {
        if (err){
            callback(err,null)
        }
        else{
            if(res){ // res == {} si aucun match user/pwd trouvé
              roleModel.getUserRole(res.id, function (error,role){
                  if (error){
                      callback(error,null)
                  }
                  else {
                      res.role = role
                      rightModel.getPrivilegeList(res.id, function (error,privilegeList){
                              if (error){
                                  callback(error,null)
                              }
                              else {
                                  res.privileges = privilegeList
                                  callback(null,res)
                              }
                      })
                  }
              })
            }
            else {
              callback(null,res)
            }
        }
    })
}
