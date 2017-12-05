var roleModel = require("../models/Role");
var videoModel = require('../models/Video');

const authAndRedirectFunction = function(req,res,next){
    const rootUrl = req.url.split('/')[1];
    let sess = req.session;
    if(sess.auth === true){
        if(!sess.user){
            sess.auth = false;
            res.status(403).send("Unauthorized Access, please refresh");
        }else{
            roleModel.getUserRole(sess.user.login, function (err,data) {
                if (err){
                    res.status(500).send("Internal Server Error")
                }
                else {
                    if (data[0]) {
                        sess.user.role = data[0].label
                    }
                    next();
                }
            })
        }
    }else{
        if(req.url != '/') {
            req.flash('info', 'Vous devez vous authentifier pour accéder à cette partie du site.')
        }
        var port = req.app.settings.port;
        /***
            Attention, cette redirection s'applique si une ressource n'est pas trouvé de façon général
            au chargement de la page d'authentification.
        ***/
        if (rootUrl != "direct" && rootUrl != "video" && rootUrl != "admin"){
            if(sess.redirectUrl === undefined){
                sess.redirectUrl = req.protocol + '://' + req.get('host');
            }
        }
        else {
            sess.redirectUrl = req.protocol + '://' + req.get('host') + req.path;
        }
        res.redirect('/auth');
    }
}

var authMiddleware = function(req,res,next){
    var sess = req.session;
    if(!sess){
        res.status(500).send("Unable to get req.session.");
    }else{
        const rootUrl=req.url.split('/')[1];
        if(rootUrl === 'auth' || rootUrl === 'res' || rootUrl == "public" || rootUrl == ""){
            if(sess.auth === true){
                if(!sess.user){
                    sess.auth = false;
                    res.status(403).send("Unauthorized Access, please refresh");
                }else {
                    roleModel.getUserRole(sess.user.login, function (err, data) {
                        if (err) {
                            res.status(500).send("Internal Server Error")
                        }
                        else {
                            if (data[0]) {
                                sess.user.role = data[0].label
                            }
                            next();
                        }
                    })
                }
            }
            else {
                next();
            }
        }
        else {
            if(rootUrl === "video"){
                const idVideo = req.url.split('/')[2];
                if(idVideo){
                    videoModel.isPublic(idVideo).subscribe({
                        next: data => {
                            if(data[0] && data[0].is_private === 1){
                                next();
                            }
                            else{
                                authAndRedirectFunction(req,res,next);
                            }
                        },
                        onError: err => {
                            console.error(err);
                            req.flash('info','Une erreur est survenue');
                            res.redirect('/auth');
                        }
                    });
                }
                else {
                    req.flash('info','Aucun id vidéo détecté.');
                    res.redirect('/auth');
                }
            }
            else {
                authAndRedirectFunction(req,res,next);
            }
        }
    }
}

module.exports=function auth(){
    return authMiddleware;
}
