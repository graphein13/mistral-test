import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Tests d'accessibilité pour l'application mistral selon les critères RGAA
 * 
 * Ces tests vérifient la conformité de l'application aux critères d'accessibilité RGAA
 * (Référentiel Général d'Amélioration de l'Accessibilité)
 */
test.describe('Accessibilité RGAA', () => {
  test.beforeEach(async ({ page }) => {
    // Se connecter avant chaque test
    await page.goto('/connexion');
    await page.getByLabel('Identifiant').fill('corinne.parent106');
    await page.getByLabel('Mot de passe').fill('motdepasse'); // À remplacer par le mot de passe réel
    await page.getByRole('button', { name: 'Se connecter' }).click();
    
    // Attendre la redirection vers le calendrier
    await expect(page).toHaveURL(/\/calendrier/, { timeout: 10000 });
  });

  test('La page de connexion doit être conforme aux critères RGAA', async ({ page }) => {
    // Naviguer vers la page de connexion
    await page.goto('/connexion');
    
    // Analyser l'accessibilité avec axe
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    // Vérifier qu'il n'y a pas de violations critiques
    expect(accessibilityScanResults.violations.filter(v => v.impact === 'critical')).toEqual([]);
    
    // Vérifier les critères RGAA spécifiques
    
    // 1. Images - Chaque image porteuse d'information a-t-elle une alternative textuelle ?
    const imagesWithoutAlt = await page.$$eval('img:not([alt]), img[alt=""]', (imgs) => imgs.length);
    expect(imagesWithoutAlt).toBe(0);
    
    // 3. Couleurs - Le contraste entre la couleur du texte et la couleur de son arrière-plan est-il suffisamment élevé ?
    // Cette vérification est incluse dans l'analyse axe
    
    // 7. Scripts - Pour chaque script qui initie un changement de contexte, l'utilisateur est-il averti ou en a-t-il le contrôle ?
    // Vérifier que les boutons ont des libellés explicites
    const buttonsWithoutText = await page.$$eval('button:not([aria-label]):not(:has(*))', (btns) => btns.length);
    expect(buttonsWithoutText).toBe(0);
    
    // 8. Éléments obligatoires - Pour chaque page web, le code source est-il valide selon le type de document spécifié ?
    // Cette vérification est partiellement incluse dans l'analyse axe
    
    // 10. Structure de l'information - Dans chaque page web, les groupes de liens importants sont-ils identifiés ?
    const navigationLandmarks = await page.$$eval('nav, [role="navigation"]', (navs) => navs.length);
    expect(navigationLandmarks).toBeGreaterThan(0);
    
    // 11. Formulaires - Chaque champ de formulaire a-t-il une étiquette ?
    const inputsWithoutLabel = await page.$$eval('input:not([aria-label]):not([aria-labelledby]):not([title])', (inputs) => inputs.length);
    expect(inputsWithoutLabel).toBe(0);
  });

  test('La page du calendrier doit être conforme aux critères RGAA', async ({ page }) => {
    // Analyser l'accessibilité avec axe
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    // Vérifier qu'il n'y a pas de violations critiques
    expect(accessibilityScanResults.violations.filter(v => v.impact === 'critical')).toEqual([]);
    
    // Vérifier les critères RGAA spécifiques pour le calendrier
    
    // 5. Tableaux - Pour chaque tableau de données, le contenu de chaque cellule est-il associé à ses en-têtes ?
    const tableWithoutHeaders = await page.$$eval('table:not(:has(th)):not(:has([role="columnheader"])):not(:has([role="rowheader"]))', (tables) => tables.length);
    expect(tableWithoutHeaders).toBe(0);
    
    // 7. Scripts - Pour chaque script qui initie un changement de contexte, l'utilisateur est-il averti ou en a-t-il le contrôle ?
    // Vérifier que les boutons de navigation du calendrier ont des libellés explicites
    const calendarButtons = await page.$$eval('button[aria-label], button:has(*[aria-label])', (btns) => btns.length);
    expect(calendarButtons).toBeGreaterThan(0);
    
    // 10. Structure de l'information - Dans chaque page web, l'information est-elle structurée par l'utilisation appropriée de titres ?
    const headings = await page.$$eval('h1, h2, h3, h4, h5, h6, [role="heading"]', (headings) => headings.length);
    expect(headings).toBeGreaterThan(0);
    
    // 12. Navigation - Dans chaque ensemble de pages, des liens d'évitement ou d'accès rapide aux groupes de liens importants sont-ils présents ?
    const skipLinks = await page.$$eval('a[href^="#"]:is(:contains("Aller au contenu"), :contains("Passer la navigation"))', (links) => links.length);
    expect(skipLinks).toBeGreaterThan(0);
  });

  test('Les fonctionnalités du calendrier doivent être accessibles au clavier', async ({ page }) => {
    // Vérifier que la navigation dans le calendrier est possible au clavier
    
    // Mettre le focus sur le calendrier
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Naviguer avec les flèches
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowDown');
    
    // Vérifier qu'une cellule du calendrier a le focus
    const focusedElement = await page.evaluate(() => {
      const activeElement = document.activeElement;
      return activeElement ? activeElement.tagName.toLowerCase() : null;
    });
    
    expect(['td', 'button', 'a']).toContain(focusedElement);
    
    // Vérifier que le bouton d'importation est accessible au clavier
    let found = false;
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      const buttonText = await page.evaluate(() => {
        const activeElement = document.activeElement;
        return activeElement ? activeElement.textContent : null;
      });
      
      if (buttonText && buttonText.includes('Importer depuis Cassiopée')) {
        found = true;
        break;
      }
    }
    
    expect(found).toBe(true);
    
    // Activer le bouton avec la touche Entrée
    await page.keyboard.press('Enter');
    
    // Vérifier que l'action a été déclenchée
    await expect(page.getByText('Récupération des audiences')).toBeVisible({ timeout: 5000 });
  });
});
