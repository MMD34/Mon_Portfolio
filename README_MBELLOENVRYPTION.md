# MBello Encryption

![Logo](assets/MbelloEncryption.png)

**MBello Encryption** est une application de chiffrement moderne et sécurisée pour Windows, offrant 6 algorithmes de chiffrement du classique au moderne, avec une interface utilisateur ultra moderne et un coffre-fort sécurisé pour vos clés.

## 🌟 Fonctionnalités

### Algorithmes de chiffrement
- **Vigenère** - Chiffrement polyalphabétique classique
- **César** - Chiffrement par décalage
- **ROT13** - Rotation de 13 positions
- **Base64** - Encodage pour transmission sûre
- **AES-GCM** - Chiffrement authentifié moderne (⭐ Recommandé)
- **ChaCha20** - Alternative moderne à AES

### Interface moderne
- 🎨 Interface CustomTkinter ultra moderne
- 🌓 Mode sombre/clair
- 📊 Indicateur de puissance des mots de passe
- 🔄 Boutons utilitaires (Copier, Coller, Échanger, Effacer)
- 📁 Import/Export de fichiers

### Coffre-fort sécurisé
- 🔒 Stockage chiffré des clés (AES-GCM)
- 🔑 Protection par mot de passe maître (PBKDF2 200,000 itérations)
- 🔍 Recherche instantanée
- 📥📤 Import/Export JSON
- 🛡️ Changement de mot de passe maître

### Utilitaires
- 🎲 Générateur de clés sécurisées
- 📝 Historique des opérations (history.log)
- 💾 Sauvegarde automatique du coffre-fort

## 📦 Installation

### Option 1: Exécutable Windows (Recommandé)

1. Téléchargez la dernière version depuis la section [Releases](https://github.com/votre-repo/releases)
2. Extrayez le dossier `MBello_Encryption`
3. Lancez `MBello_Encryption.exe`

**Note**: Windows Defender peut afficher un avertissement (application non signée). Cliquez sur "Plus d'informations" puis "Exécuter quand même".

### Option 2: Depuis les sources

**Prérequis**: Python 3.11 ou supérieur

```bash
# 1. Cloner le dépôt
git clone https://github.com/votre-repo/MBello_Encryption.git
cd MBello_Encryption

# 2. Créer un environnement virtuel
python -m venv venv

# 3. Activer l'environnement virtuel
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 4. Installer les dépendances
pip install -r requirements.txt

# 5. Lancer l'application
python main.py
```

## 🚀 Utilisation rapide

### Premier lancement
1. L'application s'ouvre sur l'onglet **Vigenère**
2. Explorez les 6 onglets de chiffrement
3. Cliquez sur **Coffre-fort** pour créer votre coffre-fort sécurisé

### Chiffrer un texte (AES-GCM recommandé)
1. Allez dans l'onglet **AES-GCM**
2. Entrez votre texte dans la zone supérieure
3. Cliquez sur **Générer** pour créer une clé sécurisée
4. **Important**: Sauvegardez cette clé dans le coffre-fort!
5. Cliquez sur **Chiffrer**
6. Le résultat apparaît dans la zone inférieure

### Utiliser le coffre-fort
1. Cliquez sur **Coffre-fort** dans la barre d'outils
2. Créez un mot de passe maître (min. 8 caractères, recommandé 16+)
3. Ajoutez vos clés avec le bouton **➕ Ajouter**
4. Utilisez la barre de recherche pour retrouver vos clés

## 📚 Documentation

- **[Guide Utilisateur](GUIDE_UTILISATEUR.md)** - Documentation complète
- **[HOW_TO_RUN.md](HOW_TO_RUN.md)** - Instructions de lancement
- **Résumés des phases** - PHASE1_SUMMARY.md à PHASE5_SUMMARY.md

## 🔒 Sécurité

### Bonnes pratiques
- ✅ Utilisez **AES-GCM** ou **ChaCha20** pour la sécurité maximale
- ✅ Créez des mots de passe de 16+ caractères
- ✅ Utilisez le générateur de clés intégré
- ✅ Stockez vos clés dans le coffre-fort
- ✅ Ne partagez JAMAIS votre mot de passe maître

### Avertissements
- ⚠️ **Vigenère, César, ROT13**: Faible sécurité, à usage éducatif uniquement
- ⚠️ **Base64**: Ce n'est PAS du chiffrement, juste de l'encodage
- ⚠️ **Mot de passe maître oublié = données perdues définitivement**

### Implémentation
- **AES-GCM**: Chiffrement authentifié (AEAD)
- **PBKDF2-SHA256**: 100,000 - 200,000 itérations
- **Clés aléatoires**: `secrets.token_bytes()` (cryptographiquement sûr)
- **Bibliothèque**: `cryptography` 46.0.3 (standard industrie)

## 🛠️ Développement

### Structure du projet
```
MBello_Encryption/
├── assets/                  # Ressources (icônes, images)
├── main.py                  # Point d'entrée
├── app_ui.py                # Interface utilisateur
├── crypto_logic.py          # Logique cryptographique
├── vault.py                 # Coffre-fort sécurisé
├── dialogs.py               # Dialogues personnalisés
├── version.py               # Gestion des versions
├── test_crypto.py           # Tests cryptographie
├── test_vault.py            # Tests coffre-fort
├── encryption.spec          # Configuration PyInstaller
└── requirements.txt         # Dépendances Python
```

### Technologies utilisées
- **Python** 3.14.0
- **CustomTkinter** 5.2.2 - Interface moderne
- **cryptography** 46.0.3 - Cryptographie professionnelle
- **Pillow** 12.0.0 - Gestion d'images
- **PyInstaller** 6.16.0 - Packaging

### Lancer les tests
```bash
# Tests cryptographie
python test_crypto.py

# Tests coffre-fort
python test_vault.py

# Résultat attendu: 19/19 tests passent
```

### Compiler l'exécutable
```bash
# Nettoyer les anciens builds
rmdir /s /q build dist

# Compiler avec PyInstaller
pyinstaller encryption.spec

# L'exécutable sera dans: dist/MBello_Encryption/
```

## 📊 Statistiques

- **Code source**: ~2,900 lignes Python
- **Tests**: 19 tests automatisés (100% passent)
- **Classes**: 9
- **Fonctions**: 90+
- **Taille exécutable**: ~50 MB (avec toutes les dépendances)

## 📝 Changelog

### Version 1.0.0 (2025-01-04)
- ✨ Version initiale
- 🔐 6 algorithmes de chiffrement
- 🏦 Coffre-fort sécurisé
- 🎨 Interface ultra moderne
- 📦 Packaging Windows

## 🤝 Contribution

Les contributions sont les bienvenues! Pour contribuer:

1. Forkez le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE.txt](LICENSE.txt) pour plus de détails.

## 👤 Auteur

**Mbello Diallo**

- GitHub: [@votre-username](https://github.com/votre-username)
- Email: votre.email@example.com

## 🙏 Remerciements

- [CustomTkinter](https://github.com/TomSchimansky/CustomTkinter) - Framework UI moderne
- [cryptography](https://cryptography.io/) - Bibliothèque cryptographique
- [PyInstaller](https://pyinstaller.org/) - Packaging Python

## ⚠️ Disclaimer

Cette application est fournie "telle quelle", sans garantie d'aucune sorte. L'auteur ne peut être tenu responsable de la perte de données due à une mauvaise utilisation ou à un oubli de mot de passe.

**Important**: Cette application est destinée à un usage personnel et éducatif. Pour un usage professionnel ou la protection de données critiques, consultez un expert en sécurité.

---

**© 2025 Mbello Diallo - MBello Encryption v1.0.0**

<p align="center">
  <img src="assets/MbelloEncryption.png" alt="MBello Encryption" width="128"/>
</p>

<p align="center">
  Made with ❤️ by Mbello Diallo
</p>
