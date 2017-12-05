# ajout/modification/affectation role

## Role : 

* addRole : ajout d'un role à la base de donnée
* addUserRole : ajoute un role à un utilisateur
* deleteRoleUser (id role) : efface dans role_user les liens entre le role choisi et les users
* deleteRoleDroit (id role) : efface dans role_droit les liens entre les droits et le role choisit
* deleteRole : supprimer un role by id (necessite d'utiliser les deux fcts au dessus au prélable)
* getUserRole : récupère le label du role d'un utilisateur à partir de son login
* addRoleDroit (idrole, id droit) : ajoute un lien entre un role et un droit dans la bdd

## User :

* findByLogin : renvoie la colonne de l'utilisateur à partir de son id
* LDAPauthECS : renvoie colonne utilisateur à partir login et mdp
* addUser : (login, surnom, mdp, is_myecs) ajoute un user
* deleteUser : supprime User à partir de id

## Droits : 

* getPrivilegeList : (id) les colonnes de droit et role et user pour un utilisateur
* getUserright : (id,rightlabel) récupère les droits de l'utilisateur
