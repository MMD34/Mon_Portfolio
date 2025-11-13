# 🚀 Guide de Déploiement - Portfolio M'bello Diallo

## 📦 Structure du Projet

Ce portfolio comprend deux parties :

### 1. Frontend (Site statique)
- **Version Tailwind** : `public/` - Déployée sur GitHub Pages
- **Version HTML/CSS** : Racine - Archive / Version alternative
- **Technologies** : Tailwind CSS, HTML5, JavaScript

### 2. Backend (Serveur API - Optionnel)
- **Serveur** : `server/` - Express.js + SQLite
- **Fonctionnalité** : Système de commentaires
- **Technologies** : Node.js, Express, SQLite3

---

## 🌐 Déploiement Frontend (GitHub Pages)

### Déploiement automatique activé ✅

Chaque fois que vous poussez sur la branche `main`, GitHub Actions :

1. ✅ Installe les dépendances Tailwind
2. ✅ Compile le CSS (`npm run build`)
3. ✅ Déploie le dossier `public/` sur la branche `gh-pages`
4. ✅ Met à jour le site sur GitHub Pages

### URL du site déployé

```
https://[votre-username].github.io/Mon_Portfolio/
```

### Vérifier le statut du déploiement

1. Allez sur votre repository GitHub
2. Cliquez sur l'onglet **Actions**
3. Vérifiez que le workflow "Deploy to GitHub Pages" est ✅

### En cas d'échec du déploiement

Consultez [GITHUB_ACTIONS_FIX.md](GITHUB_ACTIONS_FIX.md:1) pour les solutions courantes.

---

## 🖥️ Déploiement Backend (Serveur de commentaires)

### Option 1 : Développement local uniquement

Si vous voulez tester le système de commentaires en local :

```bash
# 1. Installer toutes les dépendances (y compris backend)
npm install

# 2. Ajouter des commentaires d'exemple
npm run seed

# 3. Démarrer le serveur
npm run server:dev
```

Le serveur sera accessible sur `http://localhost:3000`

### Option 2 : Déployer sur Heroku

#### Étape 1 : Préparer le projet

Créez un fichier `Procfile` à la racine :

```bash
echo "web: node server/server.js" > Procfile
```

#### Étape 2 : Déployer

```bash
# Installer Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Se connecter
heroku login

# Créer l'application
heroku create mon-portfolio-api

# Déployer
git push heroku main

# Ouvrir l'application
heroku open
```

#### Étape 3 : Mettre à jour l'URL de l'API

Dans `public/js/comments.js` et `js/comments.js` :

```javascript
const API_BASE_URL = 'https://mon-portfolio-api.herokuapp.com/api';
```

Puis redéployez le frontend :

```bash
git add .
git commit -m "Update API URL for production"
git push origin main
```

### Option 3 : Déployer sur Railway.app

1. Allez sur [Railway.app](https://railway.app/)
2. Connectez votre compte GitHub
3. Créez un nouveau projet
4. Sélectionnez votre repository
5. Railway détectera automatiquement Node.js
6. Configurez les variables d'environnement si nécessaire
7. Déployez

URL générée : `https://votre-app.railway.app`

### Option 4 : Déployer sur Render

1. Allez sur [Render.com](https://render.com/)
2. Créez un nouveau **Web Service**
3. Connectez votre repository
4. Configurez :
   - **Build Command** : `npm install`
   - **Start Command** : `node server/server.js`
5. Déployez

### Option 5 : Déployer sur Vercel (Serverless)

Pour déployer le backend sur Vercel, créez un fichier `api/comments.js` :

```javascript
const express = require('express');
const app = require('../server/server.js');

module.exports = app;
```

Puis configurez `vercel.json` :

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/server.js"
    }
  ]
}
```

---

## 🔧 Configuration des dépendances

### Pourquoi `optionalDependencies` ?

Les dépendances backend (Express, SQLite3, etc.) sont dans `optionalDependencies` pour que :

✅ **GitHub Actions** puisse builder le frontend sans installer le backend
✅ **Développement local** installe automatiquement tout
✅ **Pas d'erreur** si SQLite3 échoue lors de la compilation

### Installation en local

```bash
# Installe TOUT (frontend + backend)
npm install
```

### Installation en CI/CD (GitHub Actions)

```bash
# Installe UNIQUEMENT le frontend (Tailwind)
npm ci --omit=optional --ignore-scripts
```

---

## 📊 Workflows disponibles

### 1. Développement local (Frontend + Backend)

```bash
# Terminal 1 - Serveur backend
npm run server:dev

# Terminal 2 - Compilation Tailwind (watch mode)
npm run dev
```

Puis ouvrez :
- Frontend : `http://localhost:3000/public/index.html`
- API : `http://localhost:3000/api/health`

### 2. Développement local (Frontend uniquement)

```bash
# Compilation Tailwind
npm run dev
```

Ouvrez `public/index.html` directement dans le navigateur.

### 3. Build production (Frontend)

```bash
# Build Tailwind CSS minifié
npm run build

# Vérifier le résultat
ls public/build/tailwind.css
```

### 4. Déploiement automatique

```bash
# Commit et push
git add .
git commit -m "Update portfolio"
git push origin main

# GitHub Actions se charge du déploiement
```

---

## 🗂️ Structure des fichiers

```
Mon_Portfolio/
│
├── public/                          # Frontend (déployé sur GitHub Pages)
│   ├── index.html                   # Page principale Tailwind
│   ├── build/
│   │   └── tailwind.css            # CSS compilé (généré)
│   ├── js/
│   │   ├── script.js               # JavaScript principal
│   │   └── comments.js             # Système de commentaires
│   └── css/
│       └── comments.css            # Styles commentaires
│
├── server/                          # Backend (optionnel, non déployé sur GitHub Pages)
│   ├── server.js                   # Serveur Express + API
│   ├── seed-data.js                # Données d'exemple
│   └── database/
│       └── comments.db             # Base de données SQLite (créée automatiquement)
│
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions (déploiement automatique)
│
├── src/
│   └── css/
│       └── tailwind.css            # Source Tailwind (input)
│
├── package.json                     # Dépendances NPM
├── tailwind.config.js              # Configuration Tailwind
├── postcss.config.js               # Configuration PostCSS
│
└── Documentation/
    ├── README_COMMENTS_SYSTEM.md   # Guide système de commentaires
    ├── GITHUB_ACTIONS_FIX.md       # Fix déploiement GitHub Actions
    ├── README_DEPLOYMENT.md        # Ce fichier
    └── ...
```

---

## 🔍 Vérification du déploiement

### Frontend (GitHub Pages)

1. **Vérifier le workflow GitHub Actions**
   ```
   Repository → Actions → "Deploy to GitHub Pages" ✅
   ```

2. **Vérifier le site**
   ```
   https://[username].github.io/Mon_Portfolio/
   ```

3. **Vérifier que Tailwind est compilé**
   ```
   Inspecter la page → Sources → build/tailwind.css
   ```

### Backend (si déployé)

1. **Tester l'endpoint de santé**
   ```bash
   curl https://votre-api.herokuapp.com/api/health

   # Réponse attendue :
   {"status":"OK","message":"Server is running"}
   ```

2. **Tester les commentaires**
   ```bash
   curl https://votre-api.herokuapp.com/api/comments/zephyr
   ```

3. **Vérifier la base de données**
   - Heroku : `heroku pg:psql` (si PostgreSQL)
   - Railway/Render : Via le dashboard

---

## 🐛 Dépannage

### Erreur : "Failed to build CSS"

```bash
# Vérifier que Tailwind est installé
npm list tailwindcss

# Réinstaller si nécessaire
npm install --save-dev tailwindcss

# Rebuild
npm run build
```

### Erreur : "Cannot find module 'express'"

Vous êtes sur GitHub Pages et essayez d'utiliser le backend → **Normal !**

GitHub Pages ne supporte pas Node.js. Pour utiliser les commentaires, déployez le backend séparément.

### Erreur : "SQLite3 compilation failed"

Si vous voyez cette erreur en local :

```bash
# Solution 1 : Réinstaller SQLite3
npm uninstall sqlite3
npm install sqlite3

# Solution 2 : Utiliser une version pré-compilée
npm install sqlite3 --build-from-source=false
```

Sur GitHub Actions : **Cette erreur est ignorée** grâce à `optionalDependencies`.

### Le site ne se met pas à jour

1. **Vérifier que le workflow a réussi**
   - Actions → Dernier workflow ✅

2. **Vider le cache du navigateur**
   - Ctrl + Shift + R (Windows/Linux)
   - Cmd + Shift + R (Mac)

3. **Vérifier que gh-pages est à jour**
   ```bash
   git fetch origin
   git log origin/gh-pages
   ```

---

## 📈 Performance

### Frontend (GitHub Pages)

- ✅ **CDN global** : GitHub Pages utilise un CDN
- ✅ **HTTPS gratuit** : Certificat SSL automatique
- ✅ **Cache** : Les assets sont mis en cache
- ✅ **Tailwind optimisé** : CSS minifié en production

### Backend (selon hébergement)

- Heroku : Bon pour débuter, dort après 30 min d'inactivité (gratuit)
- Railway : Meilleure performance, pas de sleep
- Render : Bon compromis performance/prix
- Vercel : Excellent pour les fonctions serverless

---

## 🔒 Sécurité

### Variables d'environnement

Si vous déployez le backend, configurez :

```bash
# Sur Heroku
heroku config:set NODE_ENV=production
heroku config:set DATABASE_URL=...

# Sur Railway/Render
# Via le dashboard web
```

### CORS en production

Dans `server/server.js`, limitez les origines autorisées :

```javascript
const cors = require('cors');
app.use(cors({
    origin: [
        'https://votre-username.github.io',
        'http://localhost:3000'  // Pour développement
    ]
}));
```

---

## 📊 Surveillance

### GitHub Pages

- **Uptime** : Très fiable (99.9%+)
- **Analytics** : Ajoutez Google Analytics si besoin

### Backend

- **Logs Heroku** : `heroku logs --tail`
- **Logs Railway** : Via le dashboard
- **Monitoring** : Utilisez des services comme UptimeRobot

---

## ✅ Checklist de déploiement

### Frontend

- [ ] Tailwind CSS compile sans erreur (`npm run build`)
- [ ] Toutes les images sont optimisées
- [ ] Les liens sont corrects (relatifs, pas absolus)
- [ ] Le mode sombre fonctionne
- [ ] Responsive vérifié (mobile/tablet/desktop)
- [ ] Tests navigateurs (Chrome, Firefox, Safari, Edge)
- [ ] GitHub Actions workflow passe ✅
- [ ] Site accessible sur GitHub Pages

### Backend (optionnel)

- [ ] Serveur démarre sans erreur (`npm run server`)
- [ ] Base de données fonctionne
- [ ] Endpoints API testés
- [ ] CORS configuré correctement
- [ ] Variables d'environnement configurées
- [ ] Logs activés
- [ ] URL API mise à jour dans le frontend

---

## 🎯 Prochaines étapes

1. **Optimiser les images** : Convertir en WebP pour de meilleures performances
2. **Ajouter Analytics** : Google Analytics ou Plausible
3. **SEO** : Optimiser les balises meta, ajouter sitemap.xml
4. **PWA** : Transformer en Progressive Web App
5. **Tests** : Ajouter des tests automatisés
6. **CI/CD avancé** : Tests automatiques avant déploiement

---

## 📞 Support

- **Documentation** : Consultez tous les fichiers `README_*.md`
- **Issues GitHub** : Créez une issue sur le repository
- **Logs GitHub Actions** : Actions → Workflow → Logs détaillés

---

**Bon déploiement ! 🚀**
