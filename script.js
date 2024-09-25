window.onload = function() {
    // Vérifier si un cookie de session existe
    var token = getCookie('token');
    if (token) {
        // Si un cookie de session existe, afficher le contenu de la page après la connexion réussie
        window.location.href = 'nice.html';
    } else {
        // Sinon, afficher le formulaire de connexion
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('login-success').style.display = 'none';
    }

    // Délai entre les tentatives de connexion (en millisecondes)
    var delay = 5000;
    var canAttemptLogin = true; // Variable pour gérer le délai entre les tentatives

    // Ajouter un gestionnaire d'événements pour le bouton de connexion
    document.getElementById('login-button').addEventListener('click', function() {
        if (!canAttemptLogin) {
            document.getElementById('error-message').innerText = "Veuillez attendre 5 secondes avant de réessayer.";
            return;
        }

        var nom = document.getElementById('nom').value;
        var motDePasse = document.getElementById('mot-de-passe').value;

        // Désactiver le bouton de connexion pendant 5 secondes pour éviter le spam
        canAttemptLogin = false;
        document.getElementById('login-button').disabled = true;

        // Effectuer la requête de connexion
        fetch('http://192.168.65.243:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nom: nom,
                motDePasse: motDePasse
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Utilisateur ou mot de passe incorrect.');
            }
            return response.json();
        })
        .then(data => {
            // Stocker le token dans un cookie de session
            document.cookie = `token=${data.token}; path=/;`;
            // Rediriger vers une autre page après la connexion réussie
            window.location.href = 'nice.html';
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('error-message').innerText = error.message;
        })
        .finally(() => {
            // Réactiver le bouton après 5 secondes
            setTimeout(function() {
                canAttemptLogin = true;
                document.getElementById('login-button').disabled = false;
            }, delay);
        });
    });
};

// Fonction pour récupérer la valeur d'un cookie
function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}
