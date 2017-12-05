# Le routage

Le routage est simplifié par l'utilisation de **Express**, le routage est simplement la définition de la "route" qu'emprunte l'utilisateur quand il se connecte au site, sur une certaine page. Selon la page demandé (son **url**) et la **requête** utilisé, le site réagira différemment.

## Les requêtes

Lorsque l'on navigue sur internet, que l'on utilise le protocole HTTP, on utilise différents types de requêtes, quand on demande une page, cette demande est associé à ce type de requêtes. On ne voit pas directement ce type de requête.

Dans le cadre du site, ces requêtes peuvent être de deux types :

+ **GET** : requête standard, permet de simplement récupérer une page, des paramètres peuvent être envoyés dans l'URL. A une requête GET est associé l'envoie de la part du serveur à l'utilisateur.
+ **POST** : requête d'envoie de donnée, à une requête POST est associé l'envoie de donnée de l'utilisateur vers le serveur.

La définition de ces deux requête n'est qu'une norme, une requête POST peut potentiellement renvoyer une page, mais ce n'est pas le but premier de ce type de requête.

Ce point sur les requête est très important, la lecture de ce cours (d'une page seulement) peut permettre d'y voir plus clair : [Les requêtes HTTP - OC](https://openclassrooms.com/courses/les-requetes-http).

### Interpretation des requêtes par nodeJS

Express permet d'appeler le controlleur que l'on souhaite (associé à la page que l'utilisateur demandé). Il utilise pour cela deux objets : **app** et **router**. Voici l'exemple le plus basique :

```javascript
app.use('/', controllerAccueil.getPage());
```

Si l'utilisateur appel nxtelevision.com, le premier argument "matchera", ('/admin' matchera avec nxtelevision.com/admin). Le controlleur controllerAccueil sera appelé.

On peut remplacer app.use par router.use sans que cela ne change quelque chose.

Dans le contexte des requêtes, le point important est le use, cette requête peut s'écrire de trois façon différentes (on peut toujours mettre router au lieu de app) :

```javascript
app.use('/', controllerAccueil.getPage());
```

```javascript
app.get('/', controllerAccueil.getPage());
```

```javascript
app.post('/', controllerAccueil.getPage());
```

Il y a trois cas différents :

+ app.use réagira aux requêtes **GET** ou **POST**
+ app.get réagira aux requêtes **GET**
+ app.post réagira aux requêtes **POST**

Cette caractéristique est à prendre en compte, on peut ainsi, suivant la requête utilisé, faire réagire différement l'url ainsi :

```javascript
app.get('/auth', controllerAuth.getLoginPage());
```

```javascript
app.post('/auth', controllerAuth.login());
```

Ainsi, si on fait une requête GET, on voudra plutôt renvoyer la page d'authentification. Si l'on fait une requête POST, on enverra login/pwd en paramètre et on ne fera qu'authentifier l'utilisateur.

Ce routage basique expliqué autrement : [Routage de base](http://expressjs.com/fr/starter/basic-routing.html).

## Les routes

Les objets **router** et **app**, sont les même au niveau de la gestion des routes, la seul information à prendre en compte est que l'objet app peut prendre en paramètre un objet route, ce qui permet de séparer les routes des différentes parties du site. Cela permet de rendre le code beaucoup plus claire. On peut aboutir sur le schéma suivant :

* App
  * route
    * routeUser
    * routeDirect
    * routeAdmin
      * routeRole
      * routeGestionVideo
      ...
    * routePresta
      * routeInscription
    * ...

Ces routes sont appelés en fonction de l'url demandé par l'utilisateur, par exemple, si l'utilisateur demande l'url : '*/admin/video/addVideo*', les routes appelées vont être :

* App
  * route
    * routeAdmin
      * routeGestionVideo

Voici un exemple de routage :

```javascript
route.use('/', route);
```

```javascript
router.use('/admin', routeAdmin);
```

```javascript
router.use('/video', routeGestionVideo);
```

*routeGestionVideo* contiendra un appel, par exemple dynamique, au controlleur demandé (celui de gestion des vidéos).

Pour en savoir plus sur les routes, ce lien pourra aider : [Routing doc](http://expressjs.com/fr/guide/routing.html). Il explique le fond de l'utilisation de ces notions.
