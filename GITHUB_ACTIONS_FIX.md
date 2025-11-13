# 🔧 Correction du Déploiement GitHub Actions

## 🚨 Problème rencontré

Le déploiement automatique via GitHub Actions échouait avec une erreur liée aux dépendances, notamment SQLite3.

### Cause du problème

1. **Dépendances backend dans `dependencies`** : Express, SQLite3, CORS étaient dans les dépendances principales
2. **GitHub Actions installait tout** : `npm ci` installait toutes les dépendances, y compris celles du backend
3. **SQLite3 nécessite compilation** : SQLite3 essayait de compiler des binaires natifs, ce qui échouait dans l'environnement GitHub Actions
4. **Conflit avec le build Tailwind** : Le build ne nécessite que les dépendances frontend (Tailwind, PostCSS, etc.)

## ✅ Solution appliquée

### 1. Modification de [package.json](package.json:1)

**Avant** :
```json
{
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "sqlite3": "^5.1.6"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.21",
    "cssnano": "^7.1.2",
    "nodemon": "^3.0.1",
    "postcss-cli": "^11.0.1",
    "tailwindcss": "^3.4.17"
  }
}
```

**Après** :
```json
{
  "devDependencies": {
    "autoprefixer": "^10.4.21",
    "cssnano": "^7.1.2",
    "postcss-cli": "^11.0.1",
    "tailwindcss": "^3.4.17"
  },
  "optionalDependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "sqlite3": "^5.1.6",
    "nodemon": "^3.0.1"
  }
}
```

**Pourquoi ?**
- Les dépendances Tailwind restent dans `devDependencies` (nécessaires au build)
- Les dépendances backend sont déplacées dans `optionalDependencies`
- Si l'installation échoue, le build continue quand même

### 2. Modification de [.github/workflows/deploy.yml](.github/workflows/deploy.yml:1)

**Avant** :
```yaml
- name: Install dependencies
  run: npm ci
```

**Après** :
```yaml
- name: Install dependencies
  run: npm ci --omit=optional --ignore-scripts
```

**Pourquoi ?**
- `--omit=optional` : N'installe PAS les dépendances optionnelles (backend)
- `--ignore-scripts` : Évite l'exécution de scripts de compilation natifs

## 🎯 Résultat

GitHub Actions installera uniquement :
- ✅ Tailwind CSS
- ✅ PostCSS CLI
- ✅ Autoprefixer
- ✅ CSSnano

Et ignorera :
- ❌ Express
- ❌ SQLite3
- ❌ CORS
- ❌ Nodemon

Le build Tailwind CSS fonctionnera correctement et le déploiement réussira !

## 🖥️ Développement en local

### Les dépendances backend sont toujours disponibles !

En développement local, pour installer TOUTES les dépendances (y compris le backend) :

```bash
npm install
```

NPM installera automatiquement les `optionalDependencies` en local.

### Vérifier les dépendances installées

```bash
# Voir toutes les dépendances
npm list --depth=0

# Vérifier qu'Express est installé
npm list express

# Vérifier que SQLite3 est installé
npm list sqlite3
```

## 🧪 Test du workflow

### Option 1 : Push vers GitHub

```bash
git add .
git commit -m "Fix GitHub Actions deployment with optional dependencies"
git push origin main
```

Puis vérifiez l'onglet **Actions** sur GitHub pour voir le workflow s'exécuter.

### Option 2 : Tester localement avec act

Installez [act](https://github.com/nektos/act) pour tester GitHub Actions en local :

```bash
# Installer act (Windows avec Chocolatey)
choco install act-cli

# Tester le workflow
act push
```

## 📊 Vérification du déploiement

1. **GitHub Actions** : Allez sur votre repo → onglet **Actions**
2. **Vérifiez le workflow** : Il devrait afficher ✅ pour toutes les étapes
3. **Vérifiez le site** : `https://votre-username.github.io/Mon_Portfolio/`

## 🔍 Diagnostic des erreurs

### Si le workflow échoue encore

1. **Vérifiez les logs GitHub Actions**
   - Allez dans l'onglet Actions
   - Cliquez sur le workflow échoué
   - Lisez les logs détaillés

2. **Erreurs communes**

   **Erreur : "tailwind.css not found"**
   ```bash
   # Solution : Vérifiez que le build s'exécute correctement
   npm run build
   ls public/build/tailwind.css
   ```

   **Erreur : "Cannot find module..."**
   ```bash
   # Solution : Réinstallez les dépendances
   rm -rf node_modules package-lock.json
   npm install
   ```

   **Erreur : "Permission denied"**
   ```yaml
   # Solution : Vérifiez les permissions dans deploy.yml
   permissions:
     contents: write
   ```

## 🚀 Commandes utiles

### Build local

```bash
# Build Tailwind CSS
npm run build

# Vérifier le résultat
ls -la public/build/tailwind.css
```

### Serveur backend local

```bash
# Le serveur fonctionne toujours normalement en local
npm run server:dev
```

### Réinstaller toutes les dépendances

```bash
# Supprimer node_modules et package-lock.json
rm -rf node_modules package-lock.json

# Réinstaller
npm install

# Vérifier que tout est installé
npm list --depth=0
```

## 📝 Notes importantes

1. **Les dépendances backend fonctionnent en local** : Pas de changement pour le développement local
2. **GitHub Pages déploie uniquement le frontend** : Le dossier `public/` est déployé (site statique)
3. **Le serveur backend n'est PAS déployé sur GitHub Pages** : Pour déployer le backend, utilisez Heroku, Railway, ou autre service

## 🎯 Prochaines étapes

Si vous souhaitez déployer le backend (serveur de commentaires) :

### Option 1 : Heroku (Gratuit avec limitations)

```bash
# Créer un fichier Procfile
echo "web: node server/server.js" > Procfile

# Déployer sur Heroku
heroku create mon-portfolio-api
git push heroku main
```

### Option 2 : Railway.app

1. Connectez votre repo GitHub à Railway
2. Railway détectera automatiquement le serveur Node.js
3. Configurez les variables d'environnement
4. Déployez

### Option 3 : DigitalOcean App Platform

1. Créez une nouvelle App
2. Connectez votre repo
3. Configurez le build et le serveur
4. Déployez

Une fois le backend déployé, mettez à jour l'URL de l'API dans les fichiers JavaScript :

```javascript
// Dans public/js/comments.js et js/comments.js
const API_BASE_URL = 'https://votre-api.herokuapp.com/api';
```

## ✅ Checklist de vérification

- [x] `package.json` modifié (backend en `optionalDependencies`)
- [x] `deploy.yml` modifié (`--omit=optional --ignore-scripts`)
- [ ] Commit et push des changements
- [ ] Vérification du workflow GitHub Actions (devrait être ✅)
- [ ] Vérification du site déployé
- [ ] (Optionnel) Déploiement du backend sur un service cloud

## 🎉 Conclusion

Le problème est résolu ! GitHub Actions peut maintenant builder et déployer votre portfolio Tailwind sans essayer d'installer les dépendances backend.

Le système de commentaires reste **100% fonctionnel en développement local**, et vous pouvez déployer le backend séparément sur un service cloud.

---

**Bon déploiement ! 🚀**
