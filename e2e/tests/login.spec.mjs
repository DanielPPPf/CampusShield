// Only register Playwright tests when running under Playwright (not Vitest).
if (!process.env.VITEST) {
  const { test, expect } = await import('@playwright/test');

  test('login and lands on the dashboard', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByLabel(/correo institucional|institutional email/i)).toBeVisible();
    await expect(page.getByLabel(/credencial de seguridad|security credential/i)).toBeVisible();

    await page.locator('#email').fill('tester@unisabana.edu.co');
    await page.locator('#password').fill('safe-password');
    await page.getByRole('button', { name: /iniciar sesión en shield|sign in to shield/i }).click();

    await expect(page).toHaveURL(/#dashboard/);
    await expect(page.getByText(/institutional security dashboard/i)).toBeVisible();
  });
}
