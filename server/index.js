var express = require('express'); //import de la bibliothèque Express
var app = express(); //instanciation d'une application Express

// Pour s'assurer que l'on peut faire des appels AJAX au serveur
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Ici faut faire faire quelque chose à notre app...


// "route" simple
app.get('/test/*', function(req, res) {
  const msg = req.url.replace('/test/', '');
  res.json({ msg: msg });
});


// Counter - 2.3 - Un micro-service avec un état ===================================================
let counter = 0;

// Route pour obtenir la valeur du compteur
app.get('/cpt/query', function(req, res) {
  res.json({ counter: counter });
});

// Route oour incrémenter
app.get('/cpt/inc', function(req, res) {
  if (req.query.v) {
    const inc = parseInt(req.query.v);
    if (!isNaN(inc)) {
      counter += inc;
      res.json({ code: 0 });
    } else {
      res.json({ code: -1 });
    }
  } else {
    counter++;
    res.json({ code: 0 });
  }
});

// 2.4 - Micro-service de gestion de messages ===================================================
var allMsgs = [
  { msg: "Hello World", author: "Admin", date: "2025-03-16 12:00:00" },
  { msg: "foobar", author: "Antoine", date: "2025-03-16 12:05:00" },
  { msg: "CentraleSupelec Forever", author: "Marco", date: "2025-03-16 12:10:00" }
];


// Récupérer un message par son numéro
app.get('/msg/get/*', function(req, res) {
  const msgNumber = parseInt(req.url.replace('/msg/get/', ''));
  if (!isNaN(msgNumber) && msgNumber >= 0 && msgNumber < allMsgs.length) {
    res.json({ code: 1, msg: allMsgs[msgNumber] });
  } else {
    res.json({ code: 0 });
  }
});

// Récupérer le nombre de messages postés
app.get('/msg/nber', function(req, res) {
  res.json(allMsgs.length);
});

// Récupérer TOUS les messages
app.get('/msg/getAll', function(req, res) {
  res.json(allMsgs);
});

// Ajouter un message à la liste des messages
/*app.get('/msg/post/*', function(req, res) {
  const msg = decodeURIComponent(req.url.replace('/msg/post/', ''));
  allMsgs.push(msg);
  res.json({ code: 1, index: allMsgs.length - 1 });
});*/

app.get('/msg/post/*', function(req, res) {
  const data = decodeURIComponent(req.url.replace('/msg/post/', ''));
  try {
      const newMsg = JSON.parse(data);
      // Vérifier que les champs requis sont présents
      if(newMsg.msg && newMsg.author && newMsg.date) {
          allMsgs.push(newMsg);
          res.json({ code: 1, index: allMsgs.length - 1 });
      } else {
          res.json({ code: 0, error: "Données manquantes" });
      }
  } catch(e) {
      res.json({ code: 0, error: "Erreur de parsing JSON" });
  }
});


// Effacer un message de la liste
app.get('/msg/del/*', function(req, res) {
  const msgNumber = parseInt(req.url.replace('/msg/del/', ''));
  
  if (!isNaN(msgNumber) && msgNumber >= 0 && msgNumber < allMsgs.length) {
    allMsgs.splice(msgNumber, 1);
    res.json({ code: 1 });
  } else {
    res.json({ code: 0 });
  }
});

// =================================================================================

// On va mettre les "routes"  == les requêtes HTTP acceptéés par notre application.
app.get("/", function(req, res) {
  res.send("Hello")
})

app.listen(8080); //commence à accepter les requêtes
console.log("App listening on port 8080...");