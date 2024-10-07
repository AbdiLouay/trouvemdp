// Fonction pour vérifier si le token existe dans le localStorage ou les cookies
function checkToken() {
    // Vérifier si le token est présent dans le localStorage
    const tokenLocalStorage = localStorage.getItem('token');
    
    // Vérifier si le token est présent dans les cookies
    const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
    
    // Si le token n'est pas dans le localStorage ou dans les cookies, rediriger vers la page de connexion
    if (!tokenLocalStorage && !tokenCookie) {
        window.location.href = 'index.html';
    }
}

// Appeler la fonction pour vérifier le token dès le chargement de la page
checkToken();

// Récupérer le bouton de déconnexion
const logoutButton = document.getElementById('logout-button45');

// Ajouter un écouteur d'événements sur le bouton de déconnexion
logoutButton.addEventListener('click', function() {
    // Supprimer le token du localStorage
    localStorage.removeItem('token');
    
    // Supprimer le token des cookies
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Rediriger vers la page de connexion
    window.location.href = 'index.html';
});
