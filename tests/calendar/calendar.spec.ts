import { test, expect } from '@playwright/test';

/**
 * Tests du calendrier des audiences pour l'application mistral
 * 
 * Ces tests vérifient les fonctionnalités du calendrier, notamment
 * l'importation des audiences depuis Cassiopée.
 */
test.describe('Calendrier des audiences', () => {
  test.beforeEach(async ({ page }) => {
    // Se connecter avant chaque test
    await page.goto('/connexion');
    await page.getByLabel('Identifiant').fill('corinne.parent106');
    await page.getByLabel('Mot de passe').fill('motdepasse'); // À remplacer par le mot de passe réel
    await page.getByRole('button', { name: 'Se connecter' }).click();
    
    // Attendre la redirection vers le calendrier
    await expect(page).toHaveURL(/\/calendrier/, { timeout: 10000 });
  });

  test('Doit afficher le calendrier du mois courant après connexion', async ({ page }) => {
    // Vérifier que le calendrier du mois courant est affiché
    const currentMonth = new Date().toLocaleString('fr-FR', { month: 'long' });
    const currentYear = new Date().getFullYear().toString();
    
    await expect(page.getByText(currentMonth, { exact: false })).toBeVisible();
    await expect(page.getByText(currentYear, { exact: false })).toBeVisible();
    
    // Vérifier la présence des éléments du calendrier
    await expect(page.getByRole('grid')).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Lun' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Mar' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Mer' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Jeu' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Ven' })).toBeVisible();
  });

  test('Doit pouvoir naviguer entre les mois du calendrier', async ({ page }) => {
    // Cliquer sur le bouton pour aller au mois suivant
    await page.getByRole('button', { name: 'Mois suivant' }).click();
    
    // Vérifier que le mois affiché a changé
    const nextMonth = new Date(new Date().setMonth(new Date().getMonth() + 1))
      .toLocaleString('fr-FR', { month: 'long' });
    
    await expect(page.getByText(nextMonth, { exact: false })).toBeVisible();
    
    // Cliquer sur le bouton pour aller au mois précédent
    await page.getByRole('button', { name: 'Mois précédent' }).click();
    
    // Vérifier que le mois courant est à nouveau affiché
    const currentMonth = new Date().toLocaleString('fr-FR', { month: 'long' });
    await expect(page.getByText(currentMonth, { exact: false })).toBeVisible();
  });

  test('Doit pouvoir naviguer vers le mois d\'avril 2024', async ({ page }) => {
    // Naviguer vers avril 2024 (peut nécessiter plusieurs clics selon la date actuelle)
    
    // D'abord, aller à janvier de l'année courante
    while (!await page.getByText('janvier', { exact: false }).isVisible()) {
      await page.getByRole('button', { name: 'Mois précédent' }).click();
      await page.waitForTimeout(300); // Attendre un peu entre les clics
    }
    
    // Ensuite, ajuster l'année si nécessaire
    const currentYear = new Date().getFullYear();
    if (currentYear !== 2024) {
      // Si nous ne sommes pas en 2024, naviguer vers 2024
      // Cliquer sur le sélecteur d'année
      await page.getByRole('button', { name: currentYear.toString() }).click();
      
      // Sélectionner 2024
      await page.getByRole('option', { name: '2024' }).click();
    }
    
    // Enfin, naviguer vers avril
    while (!await page.getByText('avril', { exact: false }).isVisible()) {
      await page.getByRole('button', { name: 'Mois suivant' }).click();
      await page.waitForTimeout(300); // Attendre un peu entre les clics
    }
    
    // Vérifier que nous sommes bien en avril 2024
    await expect(page.getByText('avril', { exact: false })).toBeVisible();
    await expect(page.getByText('2024', { exact: false })).toBeVisible();
  });

  test('Doit pouvoir importer des audiences depuis Cassiopée', async ({ page }) => {
    // Naviguer vers avril 2024
    // (Réutilisation du code de navigation du test précédent)
    
    // D'abord, aller à janvier de l'année courante
    while (!await page.getByText('janvier', { exact: false }).isVisible()) {
      await page.getByRole('button', { name: 'Mois précédent' }).click();
      await page.waitForTimeout(300); // Attendre un peu entre les clics
    }
    
    // Ensuite, ajuster l'année si nécessaire
    const currentYear = new Date().getFullYear();
    if (currentYear !== 2024) {
      // Si nous ne sommes pas en 2024, naviguer vers 2024
      // Cliquer sur le sélecteur d'année
      await page.getByRole('button', { name: currentYear.toString() }).click();
      
      // Sélectionner 2024
      await page.getByRole('option', { name: '2024' }).click();
    }
    
    // Enfin, naviguer vers avril
    while (!await page.getByText('avril', { exact: false }).isVisible()) {
      await page.getByRole('button', { name: 'Mois suivant' }).click();
      await page.waitForTimeout(300); // Attendre un peu entre les clics
    }
    
    // Cliquer sur le bouton "Importer depuis Cassiopée"
    await page.getByRole('button', { name: 'Importer depuis Cassiopée' }).click();
    
    // Vérifier l'affichage du message de récupération
    await expect(page.getByText('Récupération des audiences en cours')).toBeVisible({ timeout: 5000 });
    
    // Attendre que les audiences soient chargées
    await expect(page.getByText('Récupération des audiences terminée')).toBeVisible({ timeout: 30000 });
    
    // Vérifier que des audiences sont affichées dans le calendrier
    // (Cette vérification dépend de la façon dont les audiences sont affichées dans l'interface)
    await expect(page.locator('.audience').first()).toBeVisible({ timeout: 5000 });
  });

  test('Doit pouvoir afficher les détails d\'une audience', async ({ page }) => {
    // Naviguer vers avril 2024 et importer les audiences
    // (Réutilisation du code d'importation du test précédent)
    
    // D'abord, aller à janvier de l'année courante
    while (!await page.getByText('janvier', { exact: false }).isVisible()) {
      await page.getByRole('button', { name: 'Mois précédent' }).click();
      await page.waitForTimeout(300); // Attendre un peu entre les clics
    }
    
    // Ensuite, ajuster l'année si nécessaire
    const currentYear = new Date().getFullYear();
    if (currentYear !== 2024) {
      // Si nous ne sommes pas en 2024, naviguer vers 2024
      // Cliquer sur le sélecteur d'année
      await page.getByRole('button', { name: currentYear.toString() }).click();
      
      // Sélectionner 2024
      await page.getByRole('option', { name: '2024' }).click();
    }
    
    // Enfin, naviguer vers avril
    while (!await page.getByText('avril', { exact: false }).isVisible()) {
      await page.getByRole('button', { name: 'Mois suivant' }).click();
      await page.waitForTimeout(300); // Attendre un peu entre les clics
    }
    
    // Importer les audiences
    await page.getByRole('button', { name: 'Importer depuis Cassiopée' }).click();
    await expect(page.getByText('Récupération des audiences terminée')).toBeVisible({ timeout: 30000 });
    
    // Cliquer sur la première audience
    await page.locator('.audience').first().click();
    
    // Vérifier que les détails de l'audience sont affichés
    await expect(page.getByText('Détails de l\'audience')).toBeVisible();
    await expect(page.getByText('Numéro de l\'affaire')).toBeVisible();
    await expect(page.getByText('Date et heure')).toBeVisible();
  });
});
