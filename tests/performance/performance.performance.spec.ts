import { test, expect } from '@playwright/test';

/**
 * Tests de performance pour l'application mistral
 * 
 * Ces tests mesurent les performances de l'application, notamment
 * les temps de chargement et de réponse des fonctionnalités principales.
 */
test.describe('Performance', () => {
  test.beforeEach(async ({ page }) => {
    // Se connecter avant chaque test
    await page.goto('/connexion');
    await page.getByLabel('Identifiant').fill('corinne.parent106');
    await page.getByLabel('Mot de passe').fill('motdepasse'); // À remplacer par le mot de passe réel
    await page.getByRole('button', { name: 'Se connecter' }).click();
    
    // Attendre la redirection vers le calendrier
    await expect(page).toHaveURL(/\/calendrier/, { timeout: 10000 });
  });

  test('Le temps de chargement initial du calendrier doit être acceptable', async ({ page }) => {
    // Mesurer le temps de chargement de la page du calendrier
    const startTime = Date.now();
    
    await page.goto('/calendrier');
    
    // Attendre que le calendrier soit complètement chargé
    await expect(page.getByRole('grid')).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    console.log(`Temps de chargement du calendrier: ${loadTime}ms`);
    
    // Le temps de chargement doit être inférieur à 3 secondes
    expect(loadTime).toBeLessThan(3000);
  });

  test('L\'importation des audiences depuis Cassiopée doit être performante', async ({ page }) => {
    // Naviguer vers avril 2024
    // D'abord, aller à janvier de l'année courante
    while (!await page.getByText('janvier', { exact: false }).isVisible()) {
      await page.getByRole('button', { name: 'Mois précédent' }).click();
      await page.waitForTimeout(300);
    }
    
    // Ensuite, ajuster l'année si nécessaire
    const currentYear = new Date().getFullYear();
    if (currentYear !== 2024) {
      await page.getByRole('button', { name: currentYear.toString() }).click();
      await page.getByRole('option', { name: '2024' }).click();
    }
    
    // Enfin, naviguer vers avril
    while (!await page.getByText('avril', { exact: false }).isVisible()) {
      await page.getByRole('button', { name: 'Mois suivant' }).click();
      await page.waitForTimeout(300);
    }
    
    // Mesurer le temps d'importation des audiences
    const startTime = Date.now();
    
    // Cliquer sur le bouton "Importer depuis Cassiopée"
    await page.getByRole('button', { name: 'Importer depuis Cassiopée' }).click();
    
    // Attendre que les audiences soient chargées
    await expect(page.getByText('Récupération des audiences terminée')).toBeVisible({ timeout: 30000 });
    
    const importTime = Date.now() - startTime;
    console.log(`Temps d'importation des audiences: ${importTime}ms`);
    
    // Le temps d'importation doit être inférieur à 10 secondes
    expect(importTime).toBeLessThan(10000);
  });

  test('La navigation entre les mois du calendrier doit être fluide', async ({ page }) => {
    // Mesurer le temps de navigation entre les mois
    const navigationTimes = [];
    
    for (let i = 0; i < 3; i++) {
      const startTime = Date.now();
      
      // Cliquer sur le bouton pour aller au mois suivant
      await page.getByRole('button', { name: 'Mois suivant' }).click();
      
      // Attendre que le calendrier soit mis à jour
      await page.waitForTimeout(500); // Attendre un peu pour s'assurer que le calendrier est mis à jour
      
      const navTime = Date.now() - startTime;
      navigationTimes.push(navTime);
      console.log(`Temps de navigation au mois suivant (${i+1}/3): ${navTime}ms`);
    }
    
    // Calculer le temps moyen de navigation
    const avgNavigationTime = navigationTimes.reduce((a, b) => a + b, 0) / navigationTimes.length;
    console.log(`Temps moyen de navigation entre les mois: ${avgNavigationTime}ms`);
    
    // Le temps moyen de navigation doit être inférieur à 500ms
    expect(avgNavigationTime).toBeLessThan(500);
  });

  test('L\'affichage des détails d\'une audience doit être rapide', async ({ page }) => {
    // Naviguer vers avril 2024 et importer les audiences
    // D'abord, aller à janvier de l'année courante
    while (!await page.getByText('janvier', { exact: false }).isVisible()) {
      await page.getByRole('button', { name: 'Mois précédent' }).click();
      await page.waitForTimeout(300);
    }
    
    // Ensuite, ajuster l'année si nécessaire
    const currentYear = new Date().getFullYear();
    if (currentYear !== 2024) {
      await page.getByRole('button', { name: currentYear.toString() }).click();
      await page.getByRole('option', { name: '2024' }).click();
    }
    
    // Enfin, naviguer vers avril
    while (!await page.getByText('avril', { exact: false }).isVisible()) {
      await page.getByRole('button', { name: 'Mois suivant' }).click();
      await page.waitForTimeout(300);
    }
    
    // Importer les audiences
    await page.getByRole('button', { name: 'Importer depuis Cassiopée' }).click();
    await expect(page.getByText('Récupération des audiences terminée')).toBeVisible({ timeout: 30000 });
    
    // Mesurer le temps d'affichage des détails d'une audience
    const startTime = Date.now();
    
    // Cliquer sur la première audience
    await page.locator('.audience').first().click();
    
    // Attendre que les détails de l'audience soient affichés
    await expect(page.getByText('Détails de l\'audience')).toBeVisible();
    
    const detailsTime = Date.now() - startTime;
    console.log(`Temps d'affichage des détails d'une audience: ${detailsTime}ms`);
    
    // Le temps d'affichage des détails doit être inférieur à 1 seconde
    expect(detailsTime).toBeLessThan(1000);
  });

  test('La taille du DOM doit être raisonnable', async ({ page }) => {
    // Mesurer la taille du DOM
    const domSize = await page.evaluate(() => document.querySelectorAll('*').length);
    console.log(`Taille du DOM (nombre d'éléments): ${domSize}`);
    
    // La taille du DOM ne doit pas être excessive (moins de 1500 éléments)
    expect(domSize).toBeLessThan(1500);
  });

  test('Les requêtes réseau doivent être optimisées', async ({ page }) => {
    // Collecter les requêtes réseau pendant la navigation
    const requests = [];
    page.on('request', request => {
      requests.push(request);
    });
    
    // Recharger la page du calendrier
    await page.goto('/calendrier');
    await expect(page.getByRole('grid')).toBeVisible();
    
    // Attendre un peu pour s'assurer que toutes les requêtes sont terminées
    await page.waitForTimeout(2000);
    
    // Analyser les requêtes
    const totalRequests = requests.length;
    const imageRequests = requests.filter(r => r.resourceType() === 'image').length;
    const scriptRequests = requests.filter(r => r.resourceType() === 'script').length;
    const styleRequests = requests.filter(r => r.resourceType() === 'stylesheet').length;
    
    console.log(`Nombre total de requêtes: ${totalRequests}`);
    console.log(`Requêtes d'images: ${imageRequests}`);
    console.log(`Requêtes de scripts: ${scriptRequests}`);
    console.log(`Requêtes de styles: ${styleRequests}`);
    
    // Le nombre total de requêtes doit être raisonnable
    expect(totalRequests).toBeLessThan(50);
  });
});
