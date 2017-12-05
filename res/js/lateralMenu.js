/**
 * Created by Arthur on 22/03/2017.
 */

var lateralMenuControl = {
    lateralMenu : null,
    status : "hidden",
    move : function(){
        if(lateralMenuControl.status == 'hidden'){
            lateralMenuControl.lateralMenu.style.left = "0";
            lateralMenuControl.status = 'showed';
        }else
            if(lateralMenuControl.status == 'showed'){
            lateralMenuControl.lateralMenu.style.left = "-284px";
            lateralMenuControl.status = 'hidden';
        }
    },
    resetPosition : function () {
        lateralMenuControl.lateralMenu.style.left = "-284px";
        lateralMenuControl.status = 'hidden';
    }
};
function moveLateralMenu(){
    lateralMenuControl.lateralMenu = document.getElementsByClassName("lateralMenu")[0];
    lateralMenuControl.move();
}

function resetLateralMenuPosition() {
    lateralMenuControl.lateralMenu = document.getElementsByClassName("lateralMenu")[0];
    lateralMenuControl.resetPosition();
}

$("body").click(function (e) {
    if ($(e.target).attr('id') != "lateralMenuButtonIco" &&
        $(e.target).attr('id') != "lateralMenuButton"){
        resetLateralMenuPosition()
    }
});

$(document).ready(function($) {
    menuWrapper = $(".lateralMenu");
    // Calcul de la marge entre le haut du document et #rocket_mobile
    fixedLimit = menuWrapper.offset().top - parseFloat(menuWrapper.css('marginTop').replace(/auto/, 0));
    // On déclenche un événement scroll pour mettre à jour le positionnement au chargement de la page
    $(window).scroll(function(event) {
        // Valeur de défilement lors du chargement de la page
        // Mise à jour du positionnement en fonction du scroll

        var windowScroll = $(window).scrollTop();

        if (windowScroll >= fixedLimit) {
            menuWrapper.css('position','fixed');
            menuWrapper.css('top','60px');
        } else {
            menuWrapper.css('position','absolute');
            menuWrapper.css('top','120px');
        }
    });
});
