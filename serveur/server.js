const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); // Importez jsonwebtoken
const app = express();
const cors = require('cors');

// Configuration de la connexion à la base de données
const dbConfig = {
    host: '192.168.65.243',
    user: 'userWeb', // Remplacez par votre nom d'utilisateur
    password: 'userWeb1234', // Remplacez par votre mot de passe
    database: 'projet1'
};

// Création d'une connexion à la base de données
const conn = mysql.createConnection(dbConfig);

// Middleware pour permettre les requêtes POST avec bodyParser
app.use(bodyParser.json());
app.use(cors());


// Middleware d'authentification
function authenticateToken(req, res, next) {
    const userCredentialsCookie = req.cookies.token; // Assurez-vous que le nom du cookie est correct

    if (!userCredentialsCookie) {
        return res.status(401).json({ error: 'Token manquant, veuillez vous connecter.' });
    }

    jwt.verify(userCredentialsCookie, 'votre_clé_secrète', (err, decodedToken) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token expiré, veuillez vous reconnecter.' });
            } else {
                return res.status(403).json({ error: 'Token invalide.' });
            }
        }
        req.user = decodedToken;
        next();
    });
}

// Route d'exemple nécessitant une authentification
app.get('/api/private', authenticateToken, (req, res) => {
    res.json({ message: 'Contenu privé accessible !' });
});

// Route de connexion
app.post('/api/login', (req, res) => {
    const { nom, motDePasse } = req.body;

    const sql = `SELECT * FROM User WHERE nom = ? AND mot_de_passe = ?`;
    conn.query(sql, [nom, motDePasse], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'exécution de la requête SQL :', err);
            return res.status(500).json({ error: 'Erreur interne du serveur' });
        }

        if (results.length > 0) {
            const user = { nom };
            const token = jwt.sign(user, 'votre_clé_secrète', { expiresIn: '7d' });

            // Stockage du token dans un cookie
            res.cookie('token', token, { httpOnly: true });

            // Envoyer le token dans la réponse JSON
            res.status(200).json({ message: 'Connexion réussie!', token: token });
        } else {
            res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe invalide.' });
        }
    });
});

// Route d'inscription
app.post('/api/register', (req, res) => {
    const { nom, motDePasse } = req.body;

    // Génération du token pour le nouvel utilisateur
    const user = { nom };
    const token = jwt.sign(user, 'votre_clé_secrète', { expiresIn: '7d' });

    // Requête SQL pour insérer l'utilisateur dans la base de données avec le token généré
    const sql = `INSERT INTO User (nom, mot_de_passe, token) VALUES (?, ?, ?)`;
    conn.query(sql, [nom, motDePasse, token], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'exécution de la requête SQL :', err);
            return res.status(500).json({ error: 'Erreur interne du serveur' });
        }

        res.status(200).json({ message: 'Inscription réussie !' });
    });
});


// Démarrage du serveur sur le port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

