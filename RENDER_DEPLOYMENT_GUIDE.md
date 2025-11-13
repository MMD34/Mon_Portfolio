# 🚀 Guide de Déploiement Render - Étape par Étape

## ✅ Vous êtes connecté à Render avec GitHub

Parfait ! Suivez maintenant ces étapes simples :

---

## 📋 Étape 1 : Créer un nouveau Web Service

1. Sur le dashboard Render, cliquez sur **"New +"** (en haut à droite)
2. Sélectionnez **"Web Service"**

---

## 📋 Étape 2 : Connecter votre repository

1. Vous verrez la liste de vos repositories GitHub
2. Cherchez **"Mon_Portfolio"** dans la liste
3. Cliquez sur **"Connect"** à droite du repository

   > Si vous ne voyez pas le repository :
   > - Cliquez sur "Configure account" en bas
   > - Donnez accès à Render pour voir vos repositories

---

## 📋 Étape 3 : Configurer le service

Remplissez les champs suivants **EXACTEMENT** comme indiqué :

### Configuration de base

| Champ | Valeur |
|-------|--------|
| **Name** | `mon-portfolio-api` |
| **Region** | Sélectionnez le plus proche (ex: Frankfurt pour Europe) |
| **Branch** | `main` |
| **Root Directory** | Laissez vide (ou `.`) |
| **Runtime** | `Node` |

### Build & Deploy

| Champ | Valeur |
|-------|--------|
| **Build Command** | `npm install` |
| **Start Command** | `node server/server.js` |

### Instance Type

| Champ | Valeur |
|-------|--------|
| **Instance Type** | Sélectionnez **"Free"** |

---

## 📋 Étape 4 : Variables d'environnement (optionnel mais recommandé)

Cliquez sur **"Advanced"** pour développer les options avancées.

Ajoutez ces variables d'environnement :

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |

> Note : Render utilise le port 10000 par défaut, mais votre serveur s'adaptera automatiquement.

---

## 📋 Étape 5 : Auto-Deploy (optionnel)

Sous **"Auto-Deploy"** :
- ✅ Cochez **"Yes"** si vous voulez que Render redéploie automatiquement à chaque push sur GitHub

---

## 📋 Étape 6 : Créer le Web Service

1. Vérifiez que tout est correct
2. Cliquez sur le gros bouton bleu **"Create Web Service"** en bas

---

## ⏳ Étape 7 : Attendre le déploiement (2-5 minutes)

Render va maintenant :
1. ✅ Cloner votre repository
2. ✅ Installer les dépendances (`npm install`)
3. ✅ Démarrer le serveur (`node server/server.js`)

Vous verrez les logs défiler en temps réel. Attendez de voir :

```
🚀 Comments API Server running on port 10000
📊 API Endpoints:
   - GET  /api/comments/:projectId
   ...
```

---

## ✅ Étape 8 : Récupérer l'URL de votre API

Une fois le déploiement terminé, en haut de la page vous verrez :

```
https://mon-portfolio-api.onrender.com
```

**Copiez cette URL !** Vous en aurez besoin pour l'étape suivante.

---

## 📋 Étape 9 : Tester l'API

Ouvrez cette URL dans votre navigateur :

```
https://mon-portfolio-api.onrender.com/api/health
```

Vous devriez voir :

```json
{
  "status": "OK",
  "message": "Server is running"
}
```

✅ **Parfait ! Votre backend est déployé !**

---

## 🔧 Étape 10 : Mettre à jour l'URL de l'API dans le frontend

**IMPORTANT** : Maintenant il faut dire à votre site web d'utiliser cette nouvelle URL.

Vous allez modifier le fichier `public/js/comments.js` ligne 8 :

**Avant** :
```javascript
const API_BASE_URL = isLocalhost ? 'http://localhost:3000/api' : null;
```

**Après** (remplacez par VOTRE URL Render) :
```javascript
const API_BASE_URL = isLocalhost ? 'http://localhost:3000/api' : 'https://mon-portfolio-api.onrender.com/api';
```

---

## 📤 Étape 11 : Commit et Push

Une fois l'URL mise à jour :

```bash
git add public/js/comments.js
git commit -m "feat: Connect frontend to Render backend API"
git push origin main
```

GitHub Actions va redéployer votre site avec la nouvelle URL.

---

## ⏳ Étape 12 : Attendre 2-3 minutes

- GitHub Actions déploie le frontend (1-2 min)
- Videz le cache de votre navigateur (Ctrl + Shift + R)

---

## 🎉 Étape 13 : Tester sur votre site !

Allez sur :
```
https://mmd34.github.io/Mon_Portfolio/portfolio-zephyr-password-manager.html
```

Essayez de laisser un commentaire → **Ça devrait marcher !** 🚀

---

## 🐛 Dépannage

### Le déploiement échoue avec une erreur SQLite

**Solution** : SQLite peut avoir des problèmes sur certaines plateformes. Ajoutez ceci dans `package.json` :

```json
"scripts": {
  "postinstall": "npm rebuild sqlite3"
}
```

### L'API ne répond pas après déploiement

**Solution** : Render met le service en "sleep" après 15 min d'inactivité (plan gratuit). La première requête le réveille (peut prendre 30 secondes).

### Erreur CORS

**Solution** : Vérifiez dans `server/server.js` que CORS autorise votre domaine GitHub Pages :

```javascript
app.use(cors({
    origin: [
        'https://mmd34.github.io',
        'http://localhost:3000'
    ]
}));
```

---

## 📊 Surveiller votre API

### Logs en temps réel

Sur Render, cliquez sur **"Logs"** dans le menu de gauche pour voir :
- Les requêtes API
- Les erreurs éventuelles
- L'activité du serveur

### Statistiques

Cliquez sur **"Metrics"** pour voir :
- Utilisation CPU/RAM
- Nombre de requêtes
- Temps de réponse

---

## 💰 Limites du plan gratuit

| Limite | Valeur |
|--------|--------|
| **Heures/mois** | 750h (suffisant pour 1 service 24/7) |
| **Bande passante** | 100 GB/mois |
| **Sleep après inactivité** | 15 minutes |
| **Temps de réveil** | ~30 secondes |
| **Base de données** | SQLite inclus (fichier local) |

---

## 🔄 Redéployer manuellement

Si besoin de redéployer :
1. Allez sur votre service Render
2. Cliquez sur **"Manual Deploy"** en haut à droite
3. Sélectionnez la branche `main`
4. Cliquez sur **"Deploy"**

---

## 🎯 Prochaines étapes (optionnel)

### 1. Ajouter des commentaires d'exemple

Une fois le backend déployé, vous pouvez ajouter des commentaires d'exemple via l'API.

### 2. Sauvegarder la base de données

Render utilise un système de fichiers éphémère. Pour persister la DB :
- Utilisez Render Disks (payant)
- Ou passez à PostgreSQL (gratuit sur Render)

### 3. Activer les notifications

Dans Render → Settings → Notifications :
- Email lors des déploiements échoués
- Slack/Discord webhooks

---

## ✅ Checklist finale

- [ ] Service Render créé et déployé
- [ ] API accessible sur `https://mon-portfolio-api.onrender.com/api/health`
- [ ] URL mise à jour dans `public/js/comments.js`
- [ ] Code poussé sur GitHub
- [ ] GitHub Actions a redéployé le site
- [ ] Cache du navigateur vidé
- [ ] Commentaires fonctionnent sur le site en production !

---

**Félicitations ! Votre système de commentaires est maintenant 100% fonctionnel en production ! 🎉**
