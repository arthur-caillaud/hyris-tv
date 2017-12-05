# Architecture global du site

Ce site est basé sur une architecture MVC, mais qu'est ce qu'une architecture MVC ?

## Le model MVC

Un modèle Modèle-Vue-Controleur c'est ça :
![Schéma MVC](https://upload.wikimedia.org/wikipedia/commons/6/63/ModeleMVC.png)

Extrêmement utilisé, notamment en PHP, le modèle MVC permet de séparer :
+ La donnée (représenté par le Modèle)
+ Son utilisation (représenté par le Controlleur)
+ Sa visualisation (représenté par la vue)

Prenons tout de suite un exemple concret : la page d'accueil.

+ Les **modèles** utilisés sont les modèles **Video** et **User**, ils contiennent toutes les fonctionnalités permettant de récupérer les informations recherché par les controlleurs dans la bdd (c'est le lien bdd-serveur).
+ **Video** et **User** sont utilisés par le **controlleur** de la page d'accueil, qui vérifie que le user est authentifié, il va récupérer les dernières vidéos.
+ Le controlleur utilise un template de **vue** qu'il remplie avec les vidéos et l'envoie à l'utilisateur.

Ainsi le modèle Modèle-Vue-Controleur permet de partionner (dans le code) la donnée, son utilisation et son affichage.

## En savoir plus

+ [Le modéle MVC](https://fr.wikipedia.org/wiki/Mod%C3%A8le-vue-contr%C3%B4leur), Wikipedia.
