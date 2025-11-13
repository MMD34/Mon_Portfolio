# 📋 Aide-mémoire - Commandes du Système de Commentaires

## 🚀 Installation et Démarrage

### Installation initiale

```bash
# Installer toutes les dépendances
npm install
```

### Démarrer le serveur API

```bash
# Mode développement (avec auto-reload)
npm run server:dev

# Mode production
npm run server
```

### Ajouter des commentaires d'exemple

```bash
# Remplir la base de données avec des commentaires de test
npm run seed
```

### Compiler Tailwind CSS

```bash
# Mode développement (watch mode)
npm run dev

# Mode production (minifié)
npm run build
```

---

## 🔧 Développement

### Démarrer tout en même temps

Ouvrez 2 terminaux :

**Terminal 1 - Serveur API** :
```bash
npm run server:dev
```

**Terminal 2 - Compilation Tailwind** :
```bash
npm run dev
```

---

## 🌐 URLs importantes

### API Endpoints

```bash
# Vérifier que le serveur fonctionne
http://localhost:3000/api/health

# Obtenir tous les commentaires d'un projet
http://localhost:3000/api/comments/zephyr
http://localhost:3000/api/comments/encryption
http://localhost:3000/api/comments/restaurant
http://localhost:3000/api/comments/machina

# Obtenir les statistiques d'un projet
http://localhost:3000/api/stats/zephyr

# Obtenir les statistiques de tous les projets
http://localhost:3000/api/stats

# Obtenir les commentaires populaires (featured)
http://localhost:3000/api/comments/featured/all
```

### Pages du portfolio

**Version Tailwind** :
```bash
http://localhost:3000/public/index.html
http://localhost:3000/public/portfolio-zephyr-password-manager.html
http://localhost:3000/public/portfolio-mbello-encryption.html
http://localhost:3000/public/portfolio-site-restaurant.html
http://localhost:3000/public/portfolio-application-mobile-machina.html
```

**Version HTML/CSS** :
```bash
http://localhost:3000/index.html
http://localhost:3000/portfolio-zephyr-password-manager.html
http://localhost:3000/portfolio-mbello-encryption.html
http://localhost:3000/portfolio-site-restaurant.html
http://localhost:3000/portfolio-application-mobile-machina.html
```

---

## 💾 Base de données SQLite

### Emplacement

```bash
server/database/comments.db
```

### Ouvrir la base de données

```bash
# Windows (si SQLite est installé)
sqlite3 server/database/comments.db

# Ou utiliser un outil GUI comme DB Browser for SQLite
```

### Commandes SQLite utiles

```sql
-- Lister toutes les tables
.tables

-- Voir tous les commentaires
SELECT * FROM comments;

-- Voir les statistiques
SELECT * FROM project_stats;

-- Compter les commentaires par projet
SELECT project_id, COUNT(*) as total
FROM comments
GROUP BY project_id;

-- Voir les commentaires d'un projet spécifique
SELECT * FROM comments WHERE project_id = 'zephyr';

-- Voir les commentaires populaires (featured)
SELECT * FROM comments WHERE is_featured = 1;

-- Marquer un commentaire comme populaire
UPDATE comments SET is_featured = 1 WHERE id = 5;

-- Supprimer un commentaire
DELETE FROM comments WHERE id = 10;

-- Vider toute la table (réinitialiser)
DELETE FROM comments;
DELETE FROM project_stats;

-- Quitter SQLite
.quit
```

---

## 🧪 Tests avec cURL

### Tester le serveur

```bash
# Health check
curl http://localhost:3000/api/health
```

### Obtenir des données

```bash
# Commentaires d'un projet
curl http://localhost:3000/api/comments/zephyr

# Statistiques d'un projet
curl http://localhost:3000/api/stats/zephyr

# Commentaires populaires
curl http://localhost:3000/api/comments/featured/all?limit=5
```

### Ajouter un commentaire

```bash
curl -X POST http://localhost:3000/api/comments \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "zephyr",
    "author_name": "Test User",
    "author_email": "test@example.com",
    "comment": "Excellent projet, très bien réalisé !",
    "rating": 5
  }'
```

### Windows PowerShell (alternative)

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/comments" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"project_id":"zephyr","author_name":"Test User","comment":"Excellent projet !","rating":5}'
```

---

## 📦 Gestion des fichiers

### Structure des fichiers importants

```
📁 server/
  └── server.js          # Serveur Express + API
  └── seed-data.js       # Script pour ajouter des données d'exemple
  └── database/
      └── comments.db    # Base de données SQLite

📁 public/               # Version Tailwind
  └── js/
      └── comments.js    # Logique JavaScript
  └── css/
      └── comments.css   # Styles CSS
  └── components/
      └── comments-section-tailwind.html
      └── featured-comments-carousel-tailwind.html

📁 js/                   # Version HTML/CSS
  └── comments.js

📁 css/                  # Version HTML/CSS
  └── comments.css

📁 components/           # Version HTML/CSS
  └── comments-section-htmlcss.html
  └── featured-comments-carousel-htmlcss.html
```

---

## 🔧 Configuration

### Modifier le port du serveur

**Fichier** : `server/server.js`

```javascript
const PORT = process.env.PORT || 3000;  // Changer 3000
```

**Ou via variable d'environnement** :

```bash
# Windows
set PORT=8080
npm run server

# Linux/Mac
PORT=8080 npm run server
```

### Modifier l'URL de l'API

**Fichiers** :
- `public/js/comments.js`
- `js/comments.js`

```javascript
const API_BASE_URL = 'http://localhost:3000/api';  // Modifier ici
```

---

## 🐛 Dépannage

### Le serveur ne démarre pas

```bash
# Réinstaller les dépendances
rm -rf node_modules
npm install

# Ou sur Windows
rmdir /s node_modules
npm install
```

### Port déjà utilisé

```bash
# Windows - Trouver le processus qui utilise le port 3000
netstat -ano | findstr :3000

# Tuer le processus (remplacer PID par le numéro trouvé)
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill
```

### Base de données corrompue

```bash
# Supprimer et recréer la base de données
rm server/database/comments.db
npm run server:dev  # Recrée automatiquement la DB
npm run seed        # Ajoute des données d'exemple
```

### Les commentaires ne se chargent pas

1. Vérifiez que le serveur est démarré
2. Ouvrez la console du navigateur (F12)
3. Vérifiez l'onglet Network pour les erreurs
4. Vérifiez que l'URL de l'API est correcte

### CORS Error

**Problème** : Les requêtes sont bloquées par CORS

**Solution** : Vérifiez `server/server.js` :

```javascript
const cors = require('cors');
app.use(cors());
```

---

## 📊 Scripts package.json

```json
{
  "scripts": {
    "dev": "Compile Tailwind CSS en mode watch",
    "build": "Compile Tailwind CSS pour production (minifié)",
    "watch": "Alias pour 'dev'",
    "server": "Démarre le serveur API en mode production",
    "server:dev": "Démarre le serveur API avec auto-reload",
    "seed": "Remplit la base de données avec des données d'exemple"
  }
}
```

---

## 🌍 Déploiement

### Préparer pour la production

```bash
# 1. Compiler Tailwind CSS
npm run build

# 2. Tester le serveur en mode production
npm run server

# 3. Vérifier que tout fonctionne
curl http://localhost:3000/api/health
```

### Variables d'environnement

Créez un fichier `.env` :

```bash
PORT=3000
NODE_ENV=production
DATABASE_PATH=./server/database/comments.db
```

Puis dans `server.js`, utilisez :

```javascript
require('dotenv').config();
const PORT = process.env.PORT || 3000;
```

---

## 🔒 Sécurité

### Recommandations pour la production

1. **Rate limiting** :

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite chaque IP à 100 requêtes par fenêtre
});

app.use('/api/', limiter);
```

2. **Helmet** (sécurité HTTP) :

```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

3. **Validation des données** :

```bash
npm install express-validator
```

---

## 📈 Maintenance

### Sauvegarder la base de données

```bash
# Créer une sauvegarde
cp server/database/comments.db server/database/comments_backup.db

# Ou avec une date
cp server/database/comments.db server/database/comments_$(date +%Y%m%d).db
```

### Nettoyer les logs

```bash
# Supprimer les fichiers de log npm
rm npm-debug.log*
rm yarn-debug.log*
```

### Mettre à jour les dépendances

```bash
# Vérifier les versions obsolètes
npm outdated

# Mettre à jour toutes les dépendances
npm update

# Mettre à jour une dépendance spécifique
npm update express
```

---

## 💡 Astuces

### Tester rapidement l'API

Installez un client API comme **Postman** ou **Insomnia**

Ou utilisez l'extension VS Code : **REST Client**

### Voir les logs en temps réel

```bash
# Le serveur affiche automatiquement les logs
npm run server:dev

# Vous verrez :
# - Requêtes HTTP
# - Erreurs SQL
# - Connexions base de données
```

### Accès à la base de données

**Outil recommandé** : [DB Browser for SQLite](https://sqlitebrowser.org/)

1. Télécharger et installer
2. Ouvrir `server/database/comments.db`
3. Visualiser et modifier les données graphiquement

---

## 📞 Support

### Fichiers de documentation

```bash
README_COMMENTS_SYSTEM.md      # Documentation complète
QUICK_START_COMMENTS.md        # Guide de démarrage rapide
DEMO_COMMENTS_SYSTEM.md        # Aperçu visuel du système
COMMANDS_CHEATSHEET.md         # Ce fichier
```

### Logs utiles

```bash
# Logs du serveur
npm run server:dev

# Logs du navigateur
F12 → Console (pour voir les erreurs JavaScript)
F12 → Network (pour voir les requêtes API)
```

---

## ✅ Checklist de vérification

Avant de mettre en production :

- [ ] Le serveur démarre sans erreur
- [ ] L'API répond sur `/api/health`
- [ ] Les commentaires s'affichent sur les pages projet
- [ ] Le formulaire fonctionne et valide correctement
- [ ] Les statistiques sont à jour
- [ ] Le carrousel fonctionne sur la page d'accueil
- [ ] Le design est cohérent sur les deux versions
- [ ] Le responsive fonctionne (mobile/tablet/desktop)
- [ ] Le mode sombre fonctionne (version Tailwind)
- [ ] La base de données est sauvegardée
- [ ] Les variables d'environnement sont configurées
- [ ] CORS est configuré pour la production
- [ ] Les dépendances sont à jour

---

**Système prêt à l'emploi ! 🚀**
