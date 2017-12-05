/**
 * Created by Arthur on 28/02/2017.
 */

/*
Ne pas oublier les require de SQL...
Communiquer avec la BDD pour récupérer le JSON de la vidéo
Module soit accessible depuis videocontroller.js
 */

var db = require('../db_management/db');
var myConst = require('../configure/myConst');
var directModel = require('../models/Direct');

var Html = {
	defaultContent : {
		head : {
		    title : "Hyris - Association TV École CentraleSupelec",
		    favicon : "/img/favicon.png",
		    meta : [
			   {name : "description",content :"Hyris est l'association télévisuelle des étudiants de l'école CentraleSupelec, fruit de la fusion entre SMS et NX Télévision. Hyris fige les souvenirs des 1500 étudiants du Campus de CentraleSupelec."}
		    ],
		    css_required : [
                {url : 'https://fonts.googleapis.com/css?family=Muli'},
                {url : 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'},
                {url : 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'},
                {url : 'https://vjs.zencdn.net/5.19.2/video-js.css'},
                {url : 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/black-tie/jquery-ui.css'},
                {url : myConst.WEB_CSS + "general.css"},
                {url : myConst.WEB_CSS + "flashMessages.css"},
                {url : myConst.WEB_CSS + "searchBar.css"},
                {url : myConst.WEB_CSS + "lateralMenu.css"},
                {url : myConst.WEB_CSS + "videojs-sublime-skin.min.css"},
                {url : myConst.WEB_CSS + "video.css"},
                {url : myConst.WEB_CSS + "videojs-resolution-switcher.css"},
                {url : myConst.WEB_CSS + "jquery.tagit.css"},
                {url : myConst.WEB_CSS + "panel.css"},
                {url : myConst.WEB_CSS + "directRootView.css"},
                {url : myConst.WEB_CSS + "auth.css"},
                {url : myConst.WEB_CSS + "directById.css"},
                {url : myConst.WEB_CSS + "tagById.css"},
                {url : myConst.WEB_CSS + "hover-min.css"},
                {url : myConst.WEB_CSS + "owl.carousel.min.css"},
                {url : myConst.WEB_CSS + "owl.theme.default.min.css"},
				{url : myConst.WEB_CSS + "jqcloud.min.css"}
            ],
            public_css : myConst.WEB_CSS + "public-home.css"
        },
		header : {
		    logo_hy : myConst.WEB_IMG + "hyris_hy.png",
		    logo_ris : myConst.WEB_IMG + "hyris_ris.png",
		    logo_small_hyris : myConst.WEB_IMG + "hyris_small.png",
		    img_lateralMenu :  myConst.WEB_IMG + "lateralMenu_button.png",
            logo_accueil : myConst.WEB_IMG + "Logo_Hyris.png",
		    lateralMenu : {},
		    external_js : [
                {src : "https://code.jquery.com/jquery-3.2.1.min.js"},
	            {src : "https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"},
			    {src : "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"},
			    {src : "https://vjs.zencdn.net/ie8/1.1.2/videojs-ie8.min.js"},
		        {src : "https://vjs.zencdn.net/5.19.2/video.js"},
	        ]
		},
		footer : {
		    copyright : "Hyris ®",
		    links : [],
		    internal_js : [
                {src : myConst.WEB_JS + "lateralMenu.js"},
                {src : myConst.WEB_JS + "tag-it.min.js"},
                {src : myConst.WEB_JS + "searchBar.js"},
				{src : myConst.WEB_JS + "owl.carousel.min.js"},
                {src : myConst.WEB_JS + "general.js"},
				{src : myConst.WEB_JS + "infinite-scroll.pkgd.min.js"}],
		},
		image : {
			defaultMiniatureVideo : myConst.WEB_IMG + "miniatureDefault.jpg",
			loadingGif : myConst.WEB_IMG + "loading.gif",
			public_banner : myConst.WEB_IMG + "public-logo.png",
            video_banner : myConst.WEB_IMG + "public-banner.mp4"
		},
		data : {
		    ip_adresse : myConst.MY_IP,
				port : myConst.PORT
				// date & datetime given in setDefaultHtml
		},
		isGranted : {

        }
	},
	prototype : {}
};

Html.prototype.setTitle = function (title){
	Html.head.title=title;
};

var manageDemand = {titre : "Gérer les demandes", lien : "/admin/manageDemand"};
var addDirect = { titre : "Ajouter un direct", lien : "/admin/addDirect"};
var	uploadVideo = {titre : "Ajouter une vidéo", lien : "/admin/uploadVideo"};
var manageRights = {titre : "Gérer les droits", lien : "/admin/manageRights"};
var manageMailingList = {titre : "Gérer la ML", lien : "/admin/manageMailingList"};
var adminPanel = [manageDemand,uploadVideo,addDirect,manageRights,manageMailingList];

var couverture = {titre : "Demande de couverture", lien : "/demand/couverture"};
var barco = {titre : "Réserver un barco", lien : "/demand/barco"};
var materiel = {titre : "Prêt de matériel", lien : "/demand/materiel"};
var demandPanel = [couverture,barco,materiel];

Html.defaultContent.adminPanel = adminPanel;

Html.defaultContent.demandPanel = demandPanel;

Html.prototype.reset = function(){
	for(var attributename in Html.defaultContent){
    Html[attributename] = JSON.parse(JSON.stringify(Html.defaultContent[attributename]));
	}
}

Html.prototype.addCss = function (cssToAdd){
	cssToAdd.forEach(function(cssUrl){
		Html.head.css_required.push(cssUrl);
	});
};
Html.prototype.addInternalJs = function (jsToAdd){
	jsToAdd.forEach(function(jsUrl){
		Html.footer.internal_js.push(jsUrl);
	});
};
Html.prototype.addMeta = function (metaToAdd){
	metaToAdd.forEach(function(meta){
		Html.head.meta.push(meta);
	});
};

module.exports = Html;
