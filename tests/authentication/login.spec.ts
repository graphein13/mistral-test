import { test, expect } from '@playwright/test';

/**
 * Tests d'authentification pour l'application mistral
 * 
 * Ces tests vérifient le processus de connexion et la redirection
 * vers le calendrier du mois courant après une connexion réussie.
 */
test.describe('Authentification', () => {
  test.beforeEach(async ({ page }) => {
    // Accéder à la page de connexion
    await page.goto('/connexion');
  });

  test('Doit afficher la page de connexion avec les champs requis', async ({ page }) => {
    // Vérifier que la page de connexion est chargée correctement
    await expect(page).toHaveTitle(/Connexion | Mistral/);
    
    // Vérifier la présence des éléments du formulaire
    await expect(page.getByLabel('Identifiant')).toBeVisible();
    await expect(page.getByLabel('Mot de passe')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Se connecter' })).toBeVisible();
  });

  test('Doit afficher une erreur avec des identifiants invalides', async ({ page }) => {
    // Remplir le formulaire avec des identifiants invalides
    await page.getByLabel('Identifiant').fill('utilisateur.invalide');
    await page.getByLabel('Mot de passe').fill('motdepasseinvalide');
    
    // Soumettre le formulaire
    await page.getByRole('button', { name: 'Se connecter' }).click();
    
    // Vérifier l'affichage d'un message d'erreur
    await expect(page.getByText('Identifiants invalides')).toBeVisible({ timeout: 5000 });
  });

  test('Doit se connecter avec succès en tant que greffe et rediriger vers le calendrier', async ({ page }) => {
    // Remplir le formulaire avec les identifiants valides du greffe
    await page.getByLabel('Identifiant').fill('corinne.parent106');
    await page.getByLabel('Mot de passe').fill('motdepasse'); // À remplacer par le mot de passe réel
    
    // Soumettre le formulaire
    await page.getByRole('button', { name: 'Se connecter' }).click();
    
    // Vérifier la redirection vers le calendrier du mois courant
    await expect(page).toHaveURL(/\/calendrier/, { timeout: 10000 });
    
    // Vérifier que le calendrier du mois courant est affiché
    const currentMonth = new Date().toLocaleString('fr-FR', { month: 'long' });
    const currentYear = new Date().getFullYear().toString();
    
    await expect(page.getByText(currentMonth, { exact: false })).toBeVisible();
    await expect(page.getByText(currentYear, { exact: false })).toBeVisible();
    
    // Vérifier que l'utilisateur est bien connecté en tant que greffe
    await expect(page.getByText('corinne.parent106', { exact: false })).toBeVisible();
  });

  test('Doit pouvoir se déconnecter après une connexion réussie', async ({ page }) => {
    // Se connecter d'abord
    await page.getByLabel('Identifiant').fill('corinne.parent106');
    await page.getByLabel('Mot de passe').fill('motdepasse'); // À remplacer par le mot de passe réel
    await page.getByRole('button', { name: 'Se connecter' }).click();
    
    // Attendre la redirection vers le calendrier
    await expect(page).toHaveURL(/\/calendrier/, { timeout: 10000 });
    
    // Cliquer sur le bouton de déconnexion (à adapter selon l'interface réelle)
    await page.getByRole('button', { name: 'Déconnexion' }).click();
    
    // Vérifier la redirection vers la page de connexion
    await expect(page).toHaveURL(/\/connexion/, { timeout: 5000 });
  });
});
