var directModel = require('../models/Direct');

var addLastDirectsToHtmlMiddleware = function (req, res, next) {
    if (req.HtmlToRender.lateralMenu){
        next();
    }
    else {
        directModel.getLastDirects(function (err, data) {
            if (err) {
                res.status(500).send(err.stack);
                console.log(err.stack);
            }
            else {
                req.HtmlToRender.header.lateralMenu = {}
                req.HtmlToRender.header.lateralMenu.lastDirects = data;
                next();
            }
        });
    }
};

module.exports = function addLastDirectsToHtml(){
    return addLastDirectsToHtmlMiddleware;
};
