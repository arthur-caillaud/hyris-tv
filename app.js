//Node_modules
var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var session = require('express-session');
var flash = require('connect-flash');

var myConst = require('./configure/myConst');

//Controllers
var videoController = require('./controllers/videoController');
var authController = require('./controllers/authController');
var roleController = require('./controllers/roleController');
var voteController = require('./controllers/voteController');

//Models
var htmlContent = require('./models/Html');
var droit = require('./models/Droit');
var direct =require('./models/Direct');
var video = require('./models/Video');

//Middlewares
var myPassport = require('./configure/myPassport');
var auth = require('./middlewares/auth');
var isGranted = require('./middlewares/isGranted');
var setDefaultHtml = require('./middlewares/setDefaultHtml');
var flashMessageToHTML = require('./middlewares/flashMessageToHTML');
var addLastDirectsToHtml = require('./middlewares/addLastDirectsToHtml');

//Routers
var routerAuth = require('./routes/routerAuth');
var routerAdmin = require('./routes/routerAdmin');
var routerDemand = require('./routes/routerDemand');
var routerUpload = require('./routes/routerUpload');
var routerSearch = require('./routes/routerSearch');

var sess;

var app = express();

app.use(express.static('res'));
app.use(session(myConst.SESSION_CONFIG));
app.use(myPassport.initialize());
app.use(myPassport.session());
app.use(helmet()); // standard security
app.use(flash()); // to send message through pages

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
}));
/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

/* upload stuff */
var exphbs   =  require( 'express-handlebars' );
app.use( express.static( __dirname + '/bower_components' ) );
app.engine( '.hbs', exphbs( { extname: '.hbs' } ) );
app.set('view engine', '.hbs');

app.use(auth());
app.use(setDefaultHtml());
app.use(addLastDirectsToHtml());
app.use(flashMessageToHTML());
app.use(isGranted());

app.use('/auth',routerAuth);
app.use('/demand',routerDemand);
app.use('/admin',routerAdmin);
app.use('/upload',routerUpload);
app.use('/', routerSearch);

app.post('/roleModification',function(req,res) {
    console.log("Received role management demand");
    sess = req.session;
    roleController.editRole(req.body.typeOf,req.body.idRole,req.body.label,req.body.description,function (error,result) {
        if (error){
            res.send("Could not apply changes");
            console.log(error);
            res.redirect('/')
        }
        else {
            res.send("Changes successfully applied");
            res.redirect('/')
        }
    })
});

app.get('/roleManagement',function (req,res) {
    sess = req.session;
    if (sess.auth){
        droit.getUserRight(sess.user.id,"addRole",function (err,right) {
            if (right) { // User can edit
                roleController.getRoleManagementPage(function (error, data) {
                    if(error) {
                        console.error(error.stack);
                        data.status(500).send('Something broke!');
                    }
                    else {
                        res.send(data)
                    }
                })
            }
            else {
                res.redirect('/')
            }
        })
    }
    else {
        res.redirect('/')
    }
});

app.get('/',function (req, res) {
    sess = req.session;
    if(sess.auth){
        videoController.getPageAccueil(req,res,function(err, data){
            if(err)
            {
                console.error(err.stack);
                res.status(500).send('Something broke!');
            }
            else
            {
                res.send(data);
            }
        });
    }
    else {
        videoController.getPublicHome(req,res,function(err,page){
            if(err)
            {
                console.error(err.stack);
                res.status(500).send('Something broke!');
            }
            else
            {
                res.send(page);
            }
        })
    }
});

app.get('/menu',function(req,res){
    sess = req.session;
    ejs.renderFile(myConst.VIEW_DIR + 'generalBlock/lateralMenu.ejs', {html : htmlContent, sess : sess }, {}, function(err, fileContent) {
        if(err){
            console.log(err.stack);
            res.send("Something broke.");
        }
        else{
            res.send(fileContent);
        }
    });
});

app.get('/logout',function(req,res){
    req.flash('info','A bientôt !')
	req.session.user={};
    req.session.auth=false;
    res.redirect('/');
});

var port = myConst.PORT;

app.listen(port, function () {
    console.log('Hyris listening on port '+port+'!');
    console.log("")
});
