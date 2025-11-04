# 🚀 Quick Start Guide - Nouveau Portfolio

## ⚡ Démarrage Rapide (2 minutes)

### Option 1: Ouvrir Immédiatement
```
📁 Mon_Portfolio/public/index.html
👉 Double-cliquez pour ouvrir dans votre navigateur
```

### Option 2: Serveur Local
```bash
cd Mon_Portfolio/public
python -m http.server 8000
```
Puis ouvrir: **http://localhost:8000**

---

## ✅ Vérification Rapide

Ouvrez le portfolio et vérifiez:

1. **Header**
   - [ ] Logo "M'bello Diallo" visible
   - [ ] Icône lune/soleil cliquable
   - [ ] Menu hamburger sur mobile

2. **Terminal Animation**
   - [ ] Commande git tape automatiquement
   - [ ] Curseur clignote à la fin

3. **Mode Sombre**
   - [ ] Cliquez sur l'icône lune
   - [ ] Tout devient sombre
   - [ ] Rechargez la page → mode sauvegardé

4. **Projets**
   - [ ] 3 cartes visibles
   - [ ] Images chargées
   - [ ] Bouton "Télécharger" Zephyr fonctionne

5. **Contact**
   - [ ] Formulaire fonctionne
   - [ ] Message "Envoyé!" apparaît après submit

---

## 🛠️ Développement

### Modifier le Portfolio

**1. Modifier le contenu:**
```
Éditez: public/index.html
Pas besoin de recompiler!
```

**2. Modifier les couleurs:**
```javascript
// tailwind.config.js
colors: {
    primary: '#D89584',  // Changez ici
}
```
Puis recompilez:
```bash
npm run dev
```

---

## 📁 Fichiers Importants

| Fichier | Description |
|---------|-------------|
| `public/index.html` | **Portfolio principal** - Éditez ici pour le contenu |
| `public/script.js` | JavaScript (dark mode, animations, formulaire) |
| `tailwind.config.js` | Configuration des couleurs et thème |
| `assets/` | Images du portfolio |
| `downloads/` | Fichiers téléchargeables (Zephyr, etc.) |

---

## 🎨 Personnalisation Rapide

### Changer la Photo de Profil
```html
<!-- public/index.html ligne ~327 -->
<img src="../profile2.jpg" alt="M'bello Diallo">
```
Remplacez `profile2.jpg` dans le dossier `assets/`

### Changer le Texte du Terminal
```javascript
// public/script.js ligne ~167
const commandText = "git clone https://github.com/Mbello-Diallo/portfolio.git";
```

### Ajouter un Projet
Copiez une carte projet existante dans `public/index.html` (section Projects) et modifiez:
- Titre
- Description
- Image (`src="../assets/votre-image.jpg"`)
- Technologies
- Liens

---

## 📖 Documentation Complète

Pour plus de détails, consultez:
- **README_NOUVEAU_PORTFOLIO.md** - Guide complet
- **MIGRATION_SUMMARY.md** - Résumé technique

---

## 🆘 Problème?

### Les images ne s'affichent pas
```
Vérifiez que les chemins sont corrects:
../assets/profile2.jpg
../project1.jpg
etc.
```

### Le CSS ne charge pas
```bash
# Recompilez:
cd Mon_Portfolio
npx postcss ./src/css/tailwind.css -o ./public/build/tailwind.css
```

### Le mode sombre ne fonctionne pas
```
1. Ouvrez la console (F12)
2. Vérifiez les erreurs
3. Vérifiez que script.js est chargé
```

---

## 🎉 C'est Tout!

Votre portfolio est prêt à être utilisé. Pour déployer:
1. Hébergez le dossier `public/` sur votre serveur
2. Assurez-vous que `assets/` et `downloads/` sont accessibles
3. Testez tous les liens

**Bon succès avec votre nouveau portfolio!** 🚀

---

*Questions? diallombello860@gmail.com*
