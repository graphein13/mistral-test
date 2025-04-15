# Tests automatisés pour le projet Mistral

Ce projet contient des tests automatisés E2E, d'accessibilité et de performance pour l'application Angular Mistral, utilisant Playwright.

## Structure du projet

```
mistral-tests/
├── tests/
│   ├── authentication/    # Tests d'authentification
│   ├── calendar/          # Tests du calendrier des audiences
│   ├── accessibility/     # Tests d'accessibilité RGAA
│   └── performance/       # Tests de performance
├── playwright.config.ts   # Configuration Playwright pour le développement local
├── playwright.config.ci.ts # Configuration Playwright pour l'environnement CI
└── .gitlab-ci.yml         # Configuration GitLab CI/CD
```

## Prérequis

- Node.js 16+
- npm ou yarn
- Accès au dépôt du projet Mistral

## Installation

1. Cloner ce dépôt à côté du projet Mistral :

```bash
git clone <url-du-repo-tests> mistral-tests
cd mistral-tests
```

2. Installer les dépendances :

```bash
npm install
```

3. Installer les navigateurs Playwright :

```bash
npx playwright install chromium
```

## Exécution des tests

### Tous les tests

```bash
npm test
```

### Tests spécifiques

```bash
# Tests d'authentification
npm run test:auth

# Tests du calendrier
npm run test:calendar

# Tests d'accessibilité
npm run test:accessibility

# Tests de performance
npm run test:performance
```

### Afficher le rapport HTML

```bash
npm run report
```

## Tests d'authentification

Les tests d'authentification vérifient :
- L'affichage correct de la page de connexion
- La gestion des identifiants invalides
- La connexion réussie avec l'utilisateur corinne.parent106 (greffe)
- La redirection vers le calendrier du mois courant après connexion
- La déconnexion

## Tests du calendrier

Les tests du calendrier vérifient :
- L'affichage du calendrier du mois courant
- La navigation entre les mois
- La navigation vers le mois d'avril 2024
- L'importation des audiences depuis Cassiopée
- L'affichage des détails d'une audience

## Tests d'accessibilité

Les tests d'accessibilité vérifient la conformité aux critères RGAA :
- Images et alternatives textuelles
- Contrastes de couleurs
- Structure de l'information
- Formulaires et étiquettes
- Navigation au clavier
- Tableaux de données

## Tests de performance

Les tests de performance mesurent :
- Le temps de chargement initial du calendrier
- Le temps d'importation des audiences depuis Cassiopée
- La fluidité de navigation entre les mois
- Le temps d'affichage des détails d'une audience
- La taille du DOM
- L'optimisation des requêtes réseau

## Intégration CI/CD

Le fichier `.gitlab-ci.yml` configure l'intégration continue avec GitLab CI/CD via Codeo (interne justice). Le pipeline exécute :

1. Installation des dépendances
2. Exécution des tests par catégorie
3. Génération d'un rapport HTML

Les variables d'environnement sont chargées depuis le fichier `.env` du projet.

## Personnalisation

### URL de base

Par défaut, les tests s'exécutent contre `http://localhost:4200`. Pour changer l'URL :

```bash
# En développement local
BASE_URL=https://votre-url.com npm test

# En CI/CD
# Modifier la variable BASE_URL dans .gitlab-ci.yml
```

### Identifiants de connexion

Les identifiants de connexion sont codés en dur dans les tests. Pour les modifier :

1. Ouvrir les fichiers de test concernés
2. Remplacer les valeurs des identifiants et mots de passe

## Bonnes pratiques

- Exécuter les tests localement avant de pousser les modifications
- Maintenir les sélecteurs à jour si l'interface change
- Ajouter des commentaires explicatifs pour les tests complexes
- Utiliser des timeouts raisonnables pour éviter les faux positifs
