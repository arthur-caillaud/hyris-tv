/**
 * Created by Arthur on 19/04/2017.
 */

var ajaxContainerSize = 12;
var currentAjaxElement = [-1,null];
var ajaxResultsMemory = [];
var numInResults = -1;
var $ajaxResultsContainer = $("#ajaxResultsContainer");
var $window = $(window);
var $searchBarWrapper = $('#searchBarWrapper');
var $search = $("#search");

function toYear(a) {
    return a.slice(0,4)
};

function sortByScore(a,b){
    if (a.score && b.score) {
        return b.score - a.score
    }
    else
        return 0
};

function switchToTagSearch(){
    $search.addClass("tagModeSearch")
}

function switchToNormalSearch(){
    $search.removeClass("tagModeSearch")
}

function logoutUser(){
    document.location.href = "../logout"
};

function toShortenedDescription(descriptionText, maxLength){
    if (descriptionText.length > maxLength){
        return (descriptionText.slice(0,maxLength)+"...")
    }
    return descriptionText
};

function ajaxSearch() {
    switchToNormalSearch();
    searchBarInput = $search.val();
    if (searchBarInput.length > 0) {
        $.ajax({
            url: '/search/ajax', // La ressource ciblée
            type: 'GET', // Le type de la requête HTTP.
            data: 'q=' + encodeURIComponent(searchBarInput),
            datatype: "json",
            success: function (json, status) {
                $ajaxResultsContainer.empty();
                ajaxResultsMemory = [];
                if (json[0]) {
                    json.sort(sortByScore)
                    for (var i = 0; i < Math.min(ajaxContainerSize,json.length); i++) {
                        if (json[i].type == "Video") {
                            ajaxResultsMemory.push({"url":'/video/' + json[i].id});
                            $ajaxResultsContainer.append($('<a href="/video/' + json[i].id + '">' +
                                '<div class = "AjaxElement" id='+"AjaxElement"+i+'><span class="AjaxElementDate">'+toYear(json[i].date)+'</span>' +
                                '<span class="AjaxElementTitle">' + json[i].label + '</span><span class="AjaxElementLabel VideoLabel">Vidéo</span></div></a>'))
                        }
                        if (json[i].type == "Direct") {
                            ajaxResultsMemory.push({"url":'/direct/' + json[i].id});
                            $ajaxResultsContainer.append($('<a href="/direct/' + json[i].id + '">' +
                                '<div class ="AjaxElement" id='+"AjaxElement"+i+'><span class="AjaxElementDate">'+toYear(json[i].date)+'</span>' +
                                '<span class="AjaxElementTitle">' + json[i].label + '</span><span class="AjaxElementLabel DirectLabel">Direct</span></div></a>'))
                        }
                    }
                    if (json[0] && $ajaxResultsContainer.attr('class') == "emptyContainer") {
                        $ajaxResultsContainer.toggleClass("emptyContainer filledContainer")
                    }
                }
                if (!json[0] && $ajaxResultsContainer.attr('class') == "filledContainer") {
                    $ajaxResultsContainer.toggleClass("filledContainer emptyContainer")
                }
            }
        })
    }
}

function ajaxTagSearch () {
    switchToTagSearch();
    searchBarInput = $search.val().slice(1);
    if (searchBarInput.length > 0) {
        $.ajax(
            {
            url: '/search/ajaxTag', // La ressource ciblée
            type: 'GET', // Le type de la requête HTTP.
            data: 'q=' + searchBarInput,
            datatype: "json",
            success: function (json, status) {
                $ajaxResultsContainer.empty();
                if (json[0]) {
                    for (var i = 0; i < Math.min(ajaxContainerSize,json.length); i++) {
                        if (json[i].type == "Video") {
                            $ajaxResultsContainer.append($('<a href="/video/' + json[i].id + '">' +
                                '<div class = "AjaxElement" id='+"AjaxElement"+i+'><span class="AjaxElementDate">'+toYear(json[i].date)+'</span>' +
                                '<span class="AjaxElementTitle">' + json[i].label + '</span><span class="AjaxElementLabel VideoLabel">Vidéo</span></div></a>'))
                        }
                        if (json[i].type == "Direct") {
                            $ajaxResultsContainer.append($('<a href="/direct/' + json[i].id + '">' +
                                '<div class ="AjaxElement" id='+"AjaxElement"+i+'><span class="AjaxElementDate">'+toYear(json[i].date)+'</span>' +
                                '<span class="AjaxElementTitle">' + json[i].label + '</span><span class="AjaxElementLabel DirectLabel">Direct</span></div></a>'))
                        }
                    }
                    if (json[0] && $ajaxResultsContainer.attr('class') == "emptyContainer") {
                        $ajaxResultsContainer.toggleClass("emptyContainer filledContainer")
                    }
                }
                if (!json[0] && $ajaxResultsContainer.attr('class') == "filledContainer") {
                    $ajaxResultsContainer.toggleClass("filledContainer emptyContainer")
                }
            }
        })
    }
}

$search.keyup(function (e) {
    if($ajaxResultsContainer.children()[currentAjaxElement[0]]) {
        $ajaxResultsContainer.children()[currentAjaxElement[0]].children[0].classList.remove("hovered")
    }
    if(e.which == 38){
        if(currentAjaxElement[0] >= 0){
            currentAjaxElement[0] += -1
            currentAjaxElement[1] = $ajaxResultsContainer.children()[currentAjaxElement]
        }
        if (currentAjaxElement[0] == -1){
            currentAjaxElement[0] = $ajaxResultsContainer.children().length -1;
            currentAjaxElement[1] = $ajaxResultsContainer.children()[currentAjaxElement];
        }
    }
    else if(e.which == 40){
        if(currentAjaxElement[0] < $ajaxResultsContainer.children().length){
            currentAjaxElement[0] += 1;
            currentAjaxElement[1] = $ajaxResultsContainer.children()[currentAjaxElement]
        }
        if(currentAjaxElement[0] == $ajaxResultsContainer.children().length){
            currentAjaxElement[0] = -1;
            currentAjaxElement[1] = null;
        }
    }
    else if(e.which == 13){
        return false
    }
    else {
        searchBarInput = $search.val();
        if (searchBarInput[0] === "#"){
            ajaxTagSearch()
        }
        else {
            ajaxSearch()
        }
    }
    if($ajaxResultsContainer.children()[currentAjaxElement[0]]) {
        $ajaxResultsContainer.children()[currentAjaxElement[0]].children[0].classList.add("hovered")
    }
})

$search.click(function (e){
    searchBarInput = $search.val();
    /*if (searchBarInput[0] === "#"){
        ajaxTagSearch()
    }
    else {*/
    ajaxSearch()
    //}
});

$("form[id=searchForm]").bind('submit',function(e){
    if (currentAjaxElement != -1) {
        document.location.href = ajaxResultsMemory[currentAjaxElement[0]].url;
        e.preventDefault();
    }
});

$("body").click(function(e){
    if ($(e.target).attr('id') != "search") {
        $ajaxResultsContainer.empty()
        $ajaxResultsContainer.addClass("emptyContainer")
        $ajaxResultsContainer.removeClass("filledContainer")
    }
});


$(document).ready(function($) {
    searchBar = $("#searchBarWrapper");
    body = $("body");
    header = $("header");
    accueil = $(".accueilHyris img");
    fixedLimit = searchBar.offset().top - parseFloat(searchBar.css('marginTop').replace(/auto/, 0));
    $(window).scroll(function(event) {
        // Valeur de défilement lors du chargement de la page
        // Mise à jour du positionnement en fonction du scroll

        var windowScroll = $(window).scrollTop();

        if (windowScroll >= fixedLimit) {
            searchBar.css('position','fixed');
            searchBar.css('top','0px');
            body.css('position','absolute');
            body.css('top','60px');
            header.css('visibility','hidden');

        } else {
            searchBar.css('position','relative');
            body.css('position','');
            header.css('visibility','');
        }
    });
    $(window).trigger("scroll");
});
