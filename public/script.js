// Sélection des éléments DOM
const themeSelect = document.getElementById('theme-select');
const messagesList = document.getElementById('messages');
const submitBtn = document.getElementById('submit-btn');
const updateBtn = document.getElementById('update-btn');
const pseudoInput = document.getElementById('pseudo');
const messageInput = document.getElementById('message');

// Sélection de l'élément pour l'URL du micro-service
const msUrlInput = document.getElementById('ms-url');

// Sélection du bouton de validation de l'URL (assurez-vous qu'il existe dans le HTML)
const validateUrlBtn = document.getElementById('validate-url');

// Fonction utilitaire pour récupérer l'URL du micro-service
function getMicroServiceUrl() {
    // On vérifie si une URL a été sauvegardée dans localStorage
    return localStorage.getItem('msUrl') || msUrlInput.value || 'http://localhost:8080';
}

// Sauvegarder la valeur quand l'utilisateur change l'adresse
msUrlInput.addEventListener('change', function() {
    localStorage.setItem('msUrl', msUrlInput.value);
});

// 1. Fonctions mathématiques (partie 3.1)

// Fonction factorielle
function fact(n) {
    if (n <= 1) return 1;
    return n * fact(n - 1);
}

// Fonction applique
function applique(f, tab) {
    return tab.map(f);
}

// Tester les fonctions dans la console
console.log("Factorielle de 6:", fact(6));
console.log("Applique fact à [1,2,3,4,5,6]:", applique(fact, [1,2,3,4,5,6]));
console.log("Applique n+1 à [1,2,3,4,5,6]:", applique(function(n) { return (n+1); }, [1,2,3,4,5,6]));

// 2. Modèle de données (partie 3.2 et 3.3)
// Initialisation du tableau de messages (valeur par défaut)
let msgs = [
    { msg: "Hello World", author: "Admin", date: "2023-01-01 12:00:00" },
    { msg: "Blah Blah", author: "User1", date: "2023-01-02 13:30:00" },
    { msg: "I love cats", author: "CatLover", date: "2023-01-03 15:45:00" },
    { msg: "Message de test", author: "Testeur", date: "2023-01-04 10:15:00" },
    { msg: "Dernier message initial", author: "Finaliste", date: "2023-01-05 21:00:00" }
];

// 3. Fonction de mise à jour de l'affichage (partie 3.2 et 3.3)
function update(messages) {
    // Effacer tous les messages actuels
    messagesList.innerHTML = '';
    
    // Ajouter chaque message du tableau
    messages.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.msg;
        
        // Ajouter les métadonnées (auteur et date)
        const metaDiv = document.createElement('div');
        metaDiv.className = 'message-meta';
        metaDiv.textContent = `Par ${item.author} le ${item.date}`;
        li.appendChild(metaDiv);
        
        messagesList.appendChild(li);
    });
}

// 4. Gestion de la soumission de messages (partie 3.3)
submitBtn.addEventListener('click', function() {
    const pseudo = pseudoInput.value.trim();
    const message = messageInput.value.trim();
    
    if (!pseudo || !message) {
        alert('Veuillez entrer un pseudo et un message.');
        return;
    }
    
    // Créer un nouvel objet message
    const newMessage = {
        msg: message,
        author: pseudo,
        date: getCurrentDateTime()
    };
    
    // Convertir l'objet en JSON et encoder pour l'URL
    const encodedMessage = encodeURIComponent(JSON.stringify(newMessage));

    // Appeler le micro-service pour poster le message
    fetch(`${getMicroServiceUrl()}/msg/post/${encodedMessage}`)
      .then(response => response.json())
      .then(result => {
          if (result.code === 1) {
              // En cas de succès, recharger la liste des messages depuis le serveur
              fetch(`${getMicroServiceUrl()}/msg/getAll`)
                .then(response => response.json())
                .then(data => {
                    update(data);
                })
                .catch(error => console.error("Erreur lors de la récupération des messages :", error));
          } else {
              alert("Erreur lors de l'ajout du message.");
          }
      })
      .catch(error => console.error("Erreur lors de l'ajout du message :", error));
    
    // Vider les champs du formulaire
    pseudoInput.value = '';
    messageInput.value = '';
});

// 5. Gestion du thème (partie 3.3)
themeSelect.addEventListener('change', function() {
    if (this.value === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    
    // Sauvegarder la préférence de thème
    localStorage.setItem('theme', this.value);
});

// Charger le thème sauvegardé et initialiser l'affichage des messages au chargement
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        themeSelect.value = savedTheme;
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }
    
    // Affichage initial : on peut utiliser les messages statiques ou lancer un fetch
    update(msgs);
});

// 6. Bouton de mise à jour (partie 3.3)
// Ici, on refetch les messages depuis le micro-service pour mettre à jour l'affichage
updateBtn.addEventListener('click', function() {
    fetch(`${getMicroServiceUrl()}/msg/getAll`)
      .then(response => response.json())
      .then(data => {
          update(data);
      })
      .catch(error => console.error("Erreur lors de la récupération des messages :", error));
});

// Fonction utilitaire pour obtenir la date et l'heure actuelles
function getCurrentDateTime() {
    const now = new Date();
    return now.toLocaleString();
}

// TD3Apart2 Coté Serveur - Prise en main ===================================================
// Récupérer les messages depuis le micro-service au chargement
document.addEventListener('DOMContentLoaded', function() {
    fetch(`${getMicroServiceUrl()}/msg/getAll`)
      .then(response => response.json())
      .then(data => {
          // Si data contient des chaînes, les transformer en objets
          const messages = data.map(item => {
              if (typeof item === 'string') {
                  return { msg: item, author: "Inconnu", date: "Date inconnue" };
              }
              return item;
          });
          update(messages);
      })
      .catch(error => {
          console.error("Erreur lors de la récupération des messages :", error);
          update(msgs);
      });
});

// Lorsque l'utilisateur clique sur "Valider" l'URL, on la sauvegarde et on met à jour les messages
validateUrlBtn.addEventListener('click', function() {
    localStorage.setItem('msUrl', msUrlInput.value);
    fetch(`${getMicroServiceUrl()}/msg/getAll`)
      .then(response => response.json())
      .then(data => {
          update(data);
      })
      .catch(error => console.error("Erreur lors de la récupération des messages :", error));
});
