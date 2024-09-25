// Récupérer le bouton de déconnexion
const logoutButton = document.getElementById('logout-button45');

// Ajouter un écouteur d'événements sur le bouton de déconnexion
logoutButton.addEventListener('click', function() {
    // Supprimer le token du localStorage
    localStorage.removeItem('token');
    
    // Supprimer le token du cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Rediriger vers la page de connexion
    window.location.href = 'index.html';
});
