# 🔍 Audit Expert - Extension Chrome Professionnelle

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Manifest](https://img.shields.io/badge/manifest-v3-green.svg)
![License](https://img.shields.io/badge/license-MIT-yellow.svg)

## 📋 Description

**Audit Expert** est une extension Chrome professionnelle (Manifest V3) qui effectue un audit complet en temps réel de n'importe quelle page web. Elle analyse trois piliers essentiels :

- **🔍 SEO** : Optimisation pour les moteurs de recherche
- **📈 Marketing** : Outils de tracking et conversion
- **💻 UX & Technique** : Expérience utilisateur et performance

L'extension fournit un score détaillé sur 100 pour chaque pilier et génère un rapport PDF professionnel téléchargeable.

---

## ✨ Fonctionnalités Principales

### 🎯 Analyse SEO
- ✅ Validation de la balise `<title>` (longueur optimale : 30-60 caractères)
- ✅ Vérification de la `<meta description>` (longueur optimale : 120-160 caractères)
- ✅ Analyse de la hiérarchie des titres (H1-H6)
- ✅ Détection du H1 unique
- ✅ Audit des images sans attribut `alt`
- ✅ Vérification de la balise `canonical`

### 📊 Analyse Marketing
- ✅ Détection de **Google Analytics 4 (GA4)**
- ✅ Détection de **Google Tag Manager (GTM)**
- ✅ Détection du **Meta Pixel** (Facebook)
- ✅ Détection de **HubSpot**
- ✅ Identification des **CTA** (Call-to-Action)
- ✅ Détection des liens vers les **réseaux sociaux** (LinkedIn, X, Facebook, Instagram)

### 🎨 Analyse UX & Technique
- ✅ Vérification du **Viewport Meta Tag** (responsive design)
- ✅ Calcul du **nombre de mots**
- ✅ Estimation du **temps de lecture**
- ✅ Comptage des **liens** (total)
- ✅ Détection des **liens cassés/vides** (`href="#"`)

### 🎁 Fonctionnalités Bonus
- 📊 **Score global** sur 100 avec visualisation circulaire animée
- 🎨 **Codage couleur** (Vert/Orange/Rouge) pour chaque métrique
- 📄 **Export PDF** : Génération d'un rapport client professionnel
- 🇫🇷 **Interface en français** avec commentaires de code pour la formation
- ⚡ **Design Modern Minimalist** : Palette Slate & Indigo, Police Inter

---

## 🚀 Installation

### Méthode 1 : Installation en Mode Développeur

1. **Télécharger l'extension**
   ```bash
   git clone https://github.com/wpformation/Chrome-Extension.git
   cd Chrome-Extension
   ```

2. **Ouvrir Chrome et accéder aux extensions**
   - Ouvrez Google Chrome
   - Allez dans `chrome://extensions/`
   - Activez le **Mode développeur** (coin supérieur droit)

3. **Charger l'extension**
   - Cliquez sur **"Charger l'extension non empaquetée"**
   - Sélectionnez le dossier du projet
   - L'extension apparaît dans votre barre d'outils Chrome

4. **Ajouter les icônes (optionnel)**
   - Créez un dossier `icons/` à la racine
   - Ajoutez vos icônes aux formats : `icon16.png`, `icon32.png`, `icon48.png`, `icon128.png`
   - Ou utilisez des icônes temporaires (l'extension fonctionnera sans)

### Méthode 2 : Installation depuis le Chrome Web Store

*Disponible prochainement*

---

## 📖 Utilisation

### Lancer une Analyse

1. **Naviguez** vers la page web que vous souhaitez auditer
2. **Cliquez** sur l'icône de l'extension dans la barre d'outils
3. **Cliquez** sur le bouton **"Lancer l'Analyse"**
4. **Attendez** quelques secondes pendant l'analyse
5. **Consultez** les résultats détaillés par pilier

### Exporter un Rapport

1. Après avoir lancé une analyse
2. Cliquez sur **"Exporter en PDF"**
3. Le rapport HTML stylisé se télécharge automatiquement
4. Ouvrez le fichier pour consulter ou imprimer le rapport

---

## 🏗️ Architecture du Projet

```
Chrome-Extension/
│
├── manifest.json          # Configuration Manifest V3
├── popup.html             # Interface utilisateur (Dashboard)
├── popup.js               # Logique de l'interface
├── content.js             # Moteur d'analyse (scraping DOM)
├── styles.css             # Styles Modern Minimalist
├── pdf-export.js          # Générateur de rapports PDF
├── README.md              # Documentation (ce fichier)
│
└── icons/                 # Icônes de l'extension
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

### Fichiers Principaux

#### 1. `manifest.json`
Fichier de configuration Manifest V3 avec :
- Permissions : `activeTab`, `scripting`, `storage`
- Host permissions : `<all_urls>`
- Content scripts : injection automatique de `content.js`

#### 2. `popup.html`
Interface utilisateur professionnelle avec :
- Header avec gradient Indigo
- Boutons d'action (Analyse & Export)
- Affichage du score global circulaire
- 3 cartes pour les 3 piliers d'analyse

#### 3. `popup.js`
Logique de l'interface :
- Communication avec `content.js` via `chrome.runtime`
- Gestion des animations et transitions
- Affichage dynamique des résultats
- Déclenchement de l'export PDF

#### 4. `content.js`
**Moteur d'analyse principal** :
- Scraping du DOM de la page
- Analyse SEO (title, meta, headings, images, canonical)
- Analyse Marketing (GA4, GTM, Meta Pixel, HubSpot, CTA, social)
- Analyse UX (viewport, word count, reading time, links)
- Calcul des scores pondérés

#### 5. `styles.css`
Design Modern Minimalist :
- Variables CSS pour la palette Slate & Indigo
- Composants réutilisables (cards, boutons, métriques)
- Animations fluides avec `cubic-bezier`
- Responsive design

#### 6. `pdf-export.js`
Générateur de rapports :
- Création d'un rapport HTML stylisé
- Formatage des données pour le client
- Téléchargement automatique
- Notification de succès

---

## 🎨 Design System

### Palette de Couleurs

**Indigo (Primary)**
- `--primary-600`: #4f46e5 (Principal)
- `--primary-700`: #4338ca (Hover)

**Slate (Neutral)**
- `--slate-700`: #334155 (Texte)
- `--slate-500`: #64748b (Texte secondaire)
- `--slate-200`: #e2e8f0 (Bordures)

**Status Colors**
- `--success`: #10b981 (Vert)
- `--warning`: #f59e0b (Orange)
- `--error`: #ef4444 (Rouge)

### Typographie

- **Police** : Inter (Google Fonts)
- **Tailles** :
  - Header Title: 20px (font-weight: 700)
  - Card Title: 16px (font-weight: 600)
  - Metrics: 13px (font-weight: 500)

---

## 🔧 Développement

### Prérequis

- Google Chrome (version 88+)
- Éditeur de code (VS Code recommandé)
- Connaissances en JavaScript vanilla

### Structure de Communication

L'extension utilise le système de messaging Chrome :

```javascript
// popup.js → content.js
chrome.tabs.sendMessage(tabId, { action: 'analyzePage' }, (response) => {
  // Traiter les résultats
});

// content.js → popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzePage') {
    const results = performCompleteAudit();
    sendResponse(results);
  }
});
```

### Système de Scoring

Chaque pilier est noté sur **100 points** :

**SEO (100 points)**
- Title optimal : 20 points
- Meta Description optimale : 20 points
- H1 unique : 20 points
- Hiérarchie correcte : 15 points
- Images avec ALT : 15 points
- Canonical présente : 10 points

**Marketing (100 points)**
- GA4 : 20 points
- GTM : 20 points
- Meta Pixel : 15 points
- HubSpot : 10 points
- CTA (≥5) : 20 points
- Réseaux sociaux (≥4) : 15 points

**UX (100 points)**
- Viewport : 25 points
- Nombre de mots (≥300) : 25 points
- Temps de lecture : 10 points
- Liens présents : 20 points
- Aucun lien cassé : 20 points

**Score Global**
```
Global = (SEO × 0.4) + (Marketing × 0.3) + (UX × 0.3)
```

---

## 📚 Guide du Formateur

### Concepts Pédagogiques

Cette extension est conçue pour la **formation** et illustre :

1. **Manifest V3** : Nouvelle norme Chrome Extensions
2. **DOM Scraping** : Analyse des éléments HTML
3. **Chrome APIs** : `chrome.tabs`, `chrome.runtime`, `chrome.scripting`
4. **Messaging Pattern** : Communication popup ↔ content script
5. **Scoring Algorithm** : Calculs pondérés et agrégation
6. **Export de données** : Génération de rapports HTML

### Points d'Enseignement

- **Sécurité** : Content Security Policy, permissions minimales
- **Performance** : Script injection `document_idle`, requêtes optimisées
- **UX** : Animations CSS, feedback utilisateur, loader states
- **Accessibilité** : Contraste couleurs, labels sémantiques
- **Code Quality** : Commentaires français, fonctions pures, séparation des responsabilités

---

## 🐛 Dépannage

### L'extension ne s'affiche pas
- Vérifiez que le Mode développeur est activé dans `chrome://extensions/`
- Rechargez l'extension après modification du code

### L'analyse ne fonctionne pas
- Rechargez la page web avant de lancer l'analyse
- Vérifiez la console JavaScript (`F12`) pour les erreurs
- Certaines pages (chrome://, file://) sont protégées et ne peuvent pas être analysées

### Le bouton "Exporter en PDF" ne fait rien
- Vérifiez que le fichier `pdf-export.js` est bien chargé
- Consultez la console pour les erreurs JavaScript
- Assurez-vous d'avoir lancé une analyse avant l'export

### Les icônes ne s'affichent pas
- Créez le dossier `icons/` avec les fichiers PNG requis
- Ou commentez les lignes `icons` dans `manifest.json`

---

## 🤝 Contribution

Les contributions sont les bienvenues !

1. **Fork** le projet
2. **Créez** une branche (`git checkout -b feature/amelioration`)
3. **Committez** vos changements (`git commit -m 'Ajout fonctionnalité'`)
4. **Pushez** sur la branche (`git push origin feature/amelioration`)
5. **Ouvrez** une Pull Request

---

## 📄 Licence

Ce projet est sous licence **MIT**. Vous êtes libre de l'utiliser, le modifier et le distribuer.

---

## 👨‍💻 Auteur

Développé avec ❤️ pour les formateurs et développeurs Full-Stack.

**Projet** : WPFormation
**GitHub** : https://github.com/wpformation/Chrome-Extension

---

## 📞 Support

Pour toute question ou suggestion :
- Ouvrez une **Issue** sur GitHub
- Consultez la **documentation** ci-dessus
- Rejoignez notre communauté de formateurs

---

## 🗺️ Roadmap

### Version 1.1 (Prochainement)
- [ ] Support multilingue (EN, ES, DE)
- [ ] Analyse de la vitesse de chargement (Core Web Vitals)
- [ ] Détection de plus d'outils marketing (LinkedIn Insight, TikTok Pixel)
- [ ] Export CSV pour analyse dans Excel
- [ ] Historique des audits dans le stockage local

### Version 2.0 (Futur)
- [ ] API REST pour audits automatisés
- [ ] Comparaison avant/après
- [ ] Suggestions d'amélioration IA
- [ ] Dashboard web avec historique complet

---

## 🙏 Remerciements

- **Google Chrome Team** : Pour l'API Extensions
- **Inter Font** : Par Rasmus Andersson
- **Communauté Open Source** : Pour l'inspiration et le partage

---

**⭐ Si ce projet vous aide, n'oubliez pas de mettre une étoile sur GitHub !**
