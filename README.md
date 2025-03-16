# Applications Web et Micro-Services — mars 2024 - TP1

Enseignant: Benoît Valiron

Mail: <benoit.valiron@centralesupelec.fr>

Bureau: Bréguet D2.22

--

Etudiant: Marco LA

Mail: <marco.la@student-cs.fr>

## Déploiement

Déploiement sur Render :

Le serveur statique (interface web) est déployé sur :
https://appliweb-forum-1.onrender.com

Le micro-service est accessible sur :
https://appliweb-forum.onrender.com

Dans l'interface web, un champ permet de définir l'adresse du micro-service. Celle-ci est sauvegardée dans le localStorage pour être utilisée lors des appels AJAX. Par défaut, l'URL est définie sur http://localhost:8080.


## Introduction

Ce TP consiste à réaliser une application web complète reposant sur deux parties complémentaires :

1. **Le client (front-end)** – Une interface web statique (HTML, CSS, JavaScript) qui :
   - Affiche la liste des messages.
   - Permet de poster un nouveau message via un formulaire.
   - Met à jour dynamiquement l'affichage grâce à des appels AJAX vers le micro-service.

2. **Le serveur (back-end)** – Un micro-service Node.js utilisant Express pour définir plusieurs routes permettant de :
   - Gérer un compteur (incrémentation et requête de la valeur).
   - Poster, récupérer, lister et supprimer des messages stockés dans une variable globale.


## Structure du projet

```
TP1/
├── package.json
├── package-lock.json
├── public
│   ├── index.html
│   ├── script.js
│   └── style.css
├── README.md
└── server
    └── index.js
```

- public/ : Contient les fichiers du client (interface web statique).
- server/ : Contient le code Node.js du micro-service.
- 




## Installation et exécution
1. Cloner le repository:
 ```bash
git clone https://github.com/marcolap13/AppliWeb-Forum
```

2. Installer les dépendances:
```bash
npm install
```

3. Lancer le serveur:
```bash
node server/index.js
```

4. Accéder à l'interface web via le fichier **public/index.html**
