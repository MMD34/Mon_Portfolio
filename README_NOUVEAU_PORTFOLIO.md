# Portfolio M'bello Diallo - Version Tailwind CSS

## 🎉 Migration Complétée

Votre portfolio a été migré avec succès vers le template Tailwind CSS moderne! Toutes vos informations personnelles, projets et contenus ont été préservés.

---

## 📁 Nouvelle Structure du Projet

```
Mon_Portfolio/
├── public/
│   ├── index.html              # Nouveau portfolio (Tailwind)
│   ├── script.js               # JavaScript avec dark mode
│   └── build/
│       └── tailwind.css        # CSS compilé (31KB)
├── src/
│   └── css/
│       └── tailwind.css        # Source CSS Tailwind
├── assets/
│   ├── profile.png             # Photo de profil
│   ├── profile2.jpg            # Photo À Propos
│   ├── project1.jpg            # Restaurant (full)
│   ├── project2.jpg            # Machina (full)
│   ├── project3.jpg            # Zephyr (full)
│   └── project*small.jpg       # Miniatures
├── downloads/
│   ├── ZephyrPasswordManager.zip
│   └── autres fichiers...
├── package.json                # Configuration NPM
├── tailwind.config.js          # Configuration Tailwind
├── postcss.config.js           # Configuration PostCSS
├── index.html                  # ⚠️ Ancien portfolio (backup)
└── style.css                   # ⚠️ Ancien CSS (backup)
```

---

## ✨ Nouvelles Fonctionnalités

### 1. **Mode Sombre / Clair** 🌓
   - Bouton de basculement dans le header
   - Sauvegarde de la préférence dans le navigateur
   - Détection automatique de la préférence système
   - Transitions fluides entre les thèmes

### 2. **Navigation Mobile Moderne** 📱
   - Menu hamburger responsive
   - Overlay plein écran
   - Animations fluides
   - Fermeture automatique au clic

### 3. **Animation Terminal** 💻
   - Effet de frappe automatique
   - Curseur clignotant
   - Commande git personnalisée

### 4. **Animations au Scroll** ✨
   - Apparition progressive des sections
   - Ombre du header au défilement
   - Cartes de projets animées
   - Transitions élégantes

### 5. **Design Moderne** 🎨
   - Couleur primaire: **#D89584** (votre corail)
   - Dégradés personnalisés
   - Ombre portée avec effet corail
   - Typographie Inter (Google Fonts)
   - Icons Font Awesome 6.7.2

---

## 🚀 Comment Utiliser

### Ouvrir le Nouveau Portfolio

1. **Ouvrir directement dans le navigateur:**
   ```
   Double-cliquez sur: Mon_Portfolio/public/index.html
   ```

2. **Ou utiliser un serveur local (recommandé):**
   ```bash
   cd Mon_Portfolio/public
   python -m http.server 8000
   ```
   Puis ouvrir: http://localhost:8000

---

## 🛠️ Développement

### Installer les Dépendances
```bash
cd Mon_Portfolio
npm install
```

### Mode Développement (Watch Mode)
Pour que Tailwind recompile automatiquement le CSS à chaque modification:
```bash
npm run dev
```
Le terminal restera ouvert et surveillera les changements dans `src/css/tailwind.css` et `public/index.html`.

### Compiler le CSS Manuellement
```bash
npx postcss ./src/css/tailwind.css -o ./public/build/tailwind.css
```

---

## 📝 Contenu Migré

### ✅ Informations Personnelles
- **Nom:** M'bello Diallo
- **Titre:** Développeur Freelance
- **Emails:**
  - diallombello860@gmail.com
  - mbello24@hotmail.ca
- **Téléphone:** +1 (873) 376-8878
- **LinkedIn:** https://www.linkedin.com/in/Mbello-Diallo
- **Bio complète:** 5 paragraphes préservés

### ✅ Projets (3)

#### 1. Site Web Restaurant Professionnel
- Technologies: HTML5, CSS3, Django, Python, PostgreSQL, Heroku
- Status: En Finalisation
- Badge jaune
- Lien vers page détails: `portfolio-site-restaurant.html`

#### 2. Machina - Application Mobile IA
- Technologies: C#, Xamarin, .NET, ML, Computer Vision, MVVM
- Status: En Finalisation
- Badge jaune
- Lien vers page détails: `portfolio-application-mobile-machina.html`

#### 3. Zephyr Password Manager
- Technologies: Python, CustomTkinter, Cryptography, Argon2, SQLite
- Status: v1.0.0
- Badge vert
- **Lien de téléchargement actif:** `downloads/ZephyrPasswordManager.zip`
- Lien vers page détails: `portfolio-zephyr-password-manager.html`

### ✅ Compétences (8)
1. HTML5 - 95%
2. Python / Django - 90%
3. JavaScript - 80%
4. C# / Xamarin - 85%
5. SQL / PostgreSQL - 85%
6. Cryptographie - 80%
7. Développement Mobile - 85%
8. Machine Learning - 75%

### ✅ Sections
- ✅ Hero avec terminal animé
- ✅ Expertise (4 domaines)
- ✅ À Propos (avec photo animée)
- ✅ Compétences (8 technologies)
- ✅ Projets (3 cartes détaillées)
- ✅ Contact (formulaire + infos)
- ✅ Footer

---

## 🎨 Personnalisation

### Modifier les Couleurs

Éditez `tailwind.config.js`:
```javascript
colors: {
    primary: '#D89584',        // Votre corail
    secondary: '#7928ca',      // Violet
    accent: '#F4A89F',         // Corail clair
    // ...
}
```

### Modifier le Texte du Terminal

Éditez `public/script.js` ligne 167:
```javascript
const commandText = "git clone https://github.com/Mbello-Diallo/portfolio.git";
```

### Modifier la Photo de Profil

Remplacez `assets/profile2.jpg` ou modifiez le lien dans `public/index.html` ligne 327:
```html
<img src="../profile2.jpg" alt="M'bello Diallo">
```

---

## 📱 Responsive Design

Le portfolio est entièrement responsive:

- **Mobile:** 320px - 767px (menu hamburger)
- **Tablet:** 768px - 1024px (2 colonnes)
- **Desktop:** 1024px+ (4 colonnes pour features/skills)

---

## 🔗 Liens Importants

### Navigation du Site
- Expertise → `#features`
- À Propos → `#about`
- Compétences → `#skills`
- Projets → `#projects`
- Contact → `#contact`

### Fichiers de Détails des Projets
Vos anciennes pages de détails sont toujours disponibles:
- `portfolio-site-restaurant.html`
- `portfolio-application-mobile-machina.html`
- `portfolio-zephyr-password-manager.html`

---

## ⚙️ Technologies Utilisées

- **Tailwind CSS** v3.4.17 - Framework CSS utility-first
- **PostCSS** - Processeur CSS
- **Autoprefixer** - Compatibilité navigateurs
- **Font Awesome** 6.7.2 - Icônes
- **Google Fonts** - Police Inter
- **Vanilla JavaScript** - Aucune dépendance lourde

---

## 🚨 Important

### Fichiers Backup
Les anciens fichiers ont été préservés:
- `index.html` (racine) - Ancien portfolio
- `style.css` - Ancien CSS
- `contact-frame.html` - Ancien frame

**Ne les supprimez pas** avant d'être certain que tout fonctionne!

### Images
Les images sont référencées depuis le dossier parent:
- `../profile2.jpg`
- `../project1.jpg`
- etc.

Si vous déplacez `public/index.html`, ajustez les chemins.

---

## 📧 Support

Pour toute question sur le portfolio:
- Email: diallombello860@gmail.com
- LinkedIn: https://www.linkedin.com/in/Mbello-Diallo

---

## 🎯 Prochaines Étapes

1. **Testez le portfolio:**
   - Ouvrez `public/index.html` dans votre navigateur
   - Testez le mode sombre/clair
   - Testez sur mobile (Responsive Mode dans DevTools)
   - Vérifiez que tous les liens fonctionnent

2. **Personnalisez si nécessaire:**
   - Modifiez les couleurs dans `tailwind.config.js`
   - Ajustez le texte dans `public/index.html`
   - Recompilez: `npm run dev`

3. **Déployez:**
   - Hébergez le dossier `public/` sur votre serveur
   - Ou utilisez GitHub Pages, Netlify, Vercel, etc.
   - Assurez-vous que les dossiers `assets/` et `downloads/` sont accessibles

4. **Mettez à jour vos projets:**
   - Quand vos projets seront finalisés, changez les badges
   - Ajoutez les liens de démo/GitHub
   - Mettez à jour les captures d'écran

---

## ✅ Checklist de Vérification

- [x] Tailwind CSS installé et compilé
- [x] Toutes les informations personnelles migrées
- [x] 3 projets avec descriptions complètes
- [x] 8 compétences avec barres de progression
- [x] Mode sombre/clair fonctionnel
- [x] Navigation mobile responsive
- [x] Formulaire de contact
- [x] Animation terminal
- [x] Animations au scroll
- [x] Images migrées vers `assets/`
- [x] Fichier de téléchargement Zephyr fonctionnel
- [x] Footer avec liens sociaux
- [x] Langue française partout

---

## 🎉 Félicitations!

Votre portfolio est maintenant modernisé avec:
- ✨ Design moderne et élégant
- 🌓 Mode sombre/clair
- 📱 Responsive sur tous les appareils
- ⚡ Animations fluides
- 🎨 Votre identité visuelle préservée (corail #D89584)
- 📝 Tout votre contenu intact

**Prêt à impressionner vos clients!** 🚀

---

*Portfolio généré avec Claude Code le 4 novembre 2025*
*Template: Tailwind Portfolio #01*
*Développé pour: M'bello Diallo - Développeur Freelance*
