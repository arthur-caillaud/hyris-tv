var Html = require('../models/Html')

var setDefaultHtmlMiddleware = function (req, res, next) {
    Html.prototype.reset();

    Html.data.date = (new Date()).toISOString().substring(0, 10);
    Html.data.datetime = (new Date()).toISOString().substring(0, 19).replace('T', ' ')

    req.HtmlToRender=Html;
    next();
}

module.exports = function setDefaultHtml(roleType){
    return setDefaultHtmlMiddleware;
}
