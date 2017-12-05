var express = require('express');
var router = express.Router();
var flash = require('connect-flash');

var authController = require('../controllers/authController')

var myPassport = require('../configure/myPassport');

router.get('/',function(req,res){
    authController.getAuthPage(function (err, data) {
        if (err) {
            console.error(err.stack);
            res.status(500).send('Something broke!');
        }
        else {
            res.send(data);
        }
    })
});

var successMessage = "Bienvenue sur le site de Hyris.tv, bonne visite !";
var failMessage = "Login ou mot de passe erroné."
router.post('/login/ldap',
    myPassport.authenticate('ldapauth', {session: false,
                                 failureFlash: failMessage, // permet de récupérer au travers de failureFlash la cause de l'echec
                                 successFlash: successMessage}),
    authController.callbackLoginLDAP);

router.post('/login/mysql',
    myPassport.authenticate('local', { failureRedirect: '/',
                                 failureFlash: failMessage, // permet de récupérer au travers de failureFlash la cause de l'echec
                                 successFlash: successMessage}), // message de réussite d'auth
    authController.callbackLoginMySQL);

router.get('/oauth2',
    myPassport.authenticate('oauth2'));

router.get('/oauth2/callback',
    myPassport.authenticate('oauth2', { failureRedirect: '/',
                                    failureFlash: failMessage, // permet de récupérer au travers de failureFlash la cause de l'echec
                                    successFlash: successMessage }),
    authController.callbackLoginOAuth2);

module.exports = router;
