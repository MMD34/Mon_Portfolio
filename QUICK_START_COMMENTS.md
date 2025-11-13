# 🚀 Guide de démarrage rapide - Système de Commentaires

## Installation en 3 étapes

### Étape 1 : Installer les dépendances

```bash
npm install
```

### Étape 2 : Démarrer le serveur

```bash
npm run server:dev
```

Le serveur démarrera sur `http://localhost:3000` ✅

### Étape 3 : Tester

Ouvrez votre navigateur et allez sur :
```
http://localhost:3000/api/health
```

Vous devriez voir : `{"status":"OK","message":"Server is running"}`

---

## 📝 Intégration rapide

### Pour la version Tailwind (public/)

#### Sur une page projet (ex: portfolio-zephyr-password-manager.html)

Ajoutez avant la balise `</body>` :

```html
<!-- Styles du système de commentaires -->
<link rel="stylesheet" href="css/comments.css">

<!-- Section Statistiques -->
<section class="py-8">
    <div class="container mx-auto px-4">
        <div id="project-stats" class="flex items-center justify-center">
            <div class="loading-spinner"></div>
        </div>
    </div>
</section>

<!-- Section Commentaires -->
<section id="comments-section" class="py-16 bg-gray-50 dark:bg-dark-background-secondary">
    <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
            <h2 class="text-3xl md:text-4xl font-bold text-center mb-12">
                <i class="fas fa-comments text-primary mr-3"></i>
                Avis et Commentaires
            </h2>

            <!-- Formulaire de commentaire -->
            <div class="bg-white dark:bg-dark-background rounded-2xl shadow-xl p-8 mb-12 border border-gray-100 dark:border-gray-800">
                <h3 class="text-2xl font-semibold mb-6 flex items-center gap-3">
                    <i class="fas fa-pen text-primary"></i>
                    Laissez votre avis
                </h3>

                <form id="comment-form" class="space-y-6">
                    <!-- Nom -->
                    <div>
                        <label for="author-name" class="block text-sm font-medium mb-2">
                            Nom <span class="text-red-500">*</span>
                        </label>
                        <input type="text" id="author-name" name="author-name" required placeholder="Votre nom"
                            class="comment-form-input w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-background-secondary text-gray-900 dark:text-white focus:outline-none focus:border-primary"/>
                    </div>

                    <!-- Email -->
                    <div>
                        <label for="author-email" class="block text-sm font-medium mb-2">
                            Email <span class="text-gray-400 text-xs">(optionnel)</span>
                        </label>
                        <input type="email" id="author-email" name="author-email" placeholder="votre.email@exemple.com"
                            class="comment-form-input w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-background-secondary text-gray-900 dark:text-white focus:outline-none focus:border-primary"/>
                    </div>

                    <!-- Note -->
                    <div>
                        <label class="block text-sm font-medium mb-3">
                            Note <span class="text-red-500">*</span>
                        </label>
                        <div id="star-rating" class="flex gap-2">
                            <i class="star fas fa-star text-gray-300 dark:text-gray-600" data-rating="1"></i>
                            <i class="star fas fa-star text-gray-300 dark:text-gray-600" data-rating="2"></i>
                            <i class="star fas fa-star text-gray-300 dark:text-gray-600" data-rating="3"></i>
                            <i class="star fas fa-star text-gray-300 dark:text-gray-600" data-rating="4"></i>
                            <i class="star fas fa-star text-gray-300 dark:text-gray-600" data-rating="5"></i>
                        </div>
                        <input type="hidden" id="rating-value" name="rating" required />
                    </div>

                    <!-- Commentaire -->
                    <div>
                        <label for="comment-text" class="block text-sm font-medium mb-2">
                            Votre commentaire <span class="text-red-500">*</span>
                        </label>
                        <textarea id="comment-text" name="comment" required rows="5" minlength="10"
                            placeholder="Partagez votre expérience avec ce projet... (minimum 10 caractères)"
                            class="comment-form-input w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-background-secondary text-gray-900 dark:text-white focus:outline-none focus:border-primary resize-none"></textarea>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            <i class="fas fa-info-circle mr-1"></i>
                            Minimum 10 caractères requis
                        </p>
                    </div>

                    <!-- Bouton -->
                    <button type="submit"
                        class="w-full px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                        <i class="fas fa-paper-plane mr-2"></i>
                        Publier mon commentaire
                    </button>
                </form>
            </div>

            <!-- Liste des commentaires -->
            <div>
                <h3 class="text-2xl font-semibold mb-6 flex items-center gap-3">
                    <i class="fas fa-message text-primary"></i>
                    Commentaires des utilisateurs
                </h3>
                <div id="comments-list" class="space-y-6">
                    <div class="flex justify-center py-8">
                        <div class="loading-spinner"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Script JavaScript -->
<script src="js/comments.js"></script>
```

#### Sur la page d'accueil (index.html)

Ajoutez entre les sections Projects et Contact :

```html
<!-- Styles du système de commentaires -->
<link rel="stylesheet" href="css/comments.css">

<!-- Carrousel de commentaires populaires -->
<section id="featured-comments-section" class="py-24 bg-gradient-to-br from-gray-50 to-white dark:from-dark-background-secondary dark:to-dark-background">
    <div class="container mx-auto px-4">
        <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold mb-4">
                <i class="fas fa-star text-yellow-400 mr-3"></i>
                Ce qu'ils pensent de mes projets
            </h2>
            <p class="text-xl text-gray-600 dark:text-gray-400">
                Découvrez les avis de ceux qui ont testé mes applications
            </p>
        </div>

        <div class="max-w-4xl mx-auto">
            <div id="featured-comments-carousel">
                <div class="flex justify-center py-16">
                    <div class="text-center">
                        <div class="loading-spinner mx-auto mb-4"></div>
                        <p class="text-gray-500 dark:text-gray-400">Chargement des commentaires...</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="text-center mt-12">
            <a href="#projects" class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
                <i class="fas fa-eye"></i>
                <span>Voir tous les projets</span>
            </a>
        </div>
    </div>
</section>

<!-- Script JavaScript -->
<script src="js/comments.js"></script>
```

---

### Pour la version HTML/CSS (root)

C'est exactement le même principe, mais utilisez les fichiers à la racine :
- `js/comments.js` au lieu de `public/js/comments.js`
- `css/comments.css` au lieu de `public/css/comments.css`

Le HTML est similaire, mais utilisez des styles inline au lieu des classes Tailwind.

Référez-vous aux fichiers dans `components/` pour le code complet.

---

## 🎯 IDs de projets

Le système détecte automatiquement le projet depuis le nom du fichier :

| Fichier | ID du projet |
|---------|-------------|
| `portfolio-site-restaurant.html` | `restaurant` |
| `portfolio-application-mobile-machina.html` | `machina` |
| `portfolio-zephyr-password-manager.html` | `zephyr` |
| `portfolio-mbello-encryption.html` | `encryption` |

---

## ✅ Vérification

### 1. Tester l'API

Ouvrez : `http://localhost:3000/api/health`

### 2. Tester sur une page projet

Ouvrez : `http://localhost:3000/public/portfolio-zephyr-password-manager.html`

### 3. Ajouter un commentaire

1. Remplissez le formulaire
2. Cliquez sur les étoiles pour noter
3. Soumettez
4. Le commentaire devrait apparaître dans la liste !

---

## 📚 Documentation complète

Pour plus de détails, consultez [README_COMMENTS_SYSTEM.md](README_COMMENTS_SYSTEM.md)

---

## 🆘 Besoin d'aide ?

### Problème : Le serveur ne démarre pas

```bash
npm install
npm run server:dev
```

### Problème : Les commentaires ne s'affichent pas

1. Vérifiez que le serveur est démarré
2. Ouvrez la console du navigateur (F12)
3. Vérifiez les erreurs réseau

### Problème : CORS Error

Assurez-vous que CORS est activé dans `server/server.js` :

```javascript
const cors = require('cors');
app.use(cors());
```

---

**C'est tout ! Votre système de commentaires est prêt ! 🎉**
