function middlewareFlashMessageToHTML(req,res,next){
    req.HtmlToRender.header.messages = {}
    req.HtmlToRender.header.messages.success = req.flash('success');
    req.HtmlToRender.header.messages.fail = req.flash('fail');
    req.HtmlToRender.header.messages.error = req.flash('error');
    req.HtmlToRender.header.messages.info = req.flash('info');
    next();
}

module.exports=function flashMessageToHTML(){
    return middlewareFlashMessageToHTML;
}
