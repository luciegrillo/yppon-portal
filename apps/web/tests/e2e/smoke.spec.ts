import { expect, test } from '@playwright/test';

const publicRoutes = [
  {
    heading: /a ordem sustenta\s*o progresso/i,
    name: 'portal home',
    path: '/',
  },
  {
    heading: /a formação que\s*sustenta o estado/i,
    name: 'IUGY public page',
    path: '/instituicoes/iugy',
  },
];

for (const route of publicRoutes) {
  test(`${route.name} loads without fatal browser errors`, async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const response = await page.goto(route.path, { waitUntil: 'networkidle' });

    expect(response?.ok()).toBe(true);
    await expect(page.locator('main#main-content')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toContainText(route.heading);
    await expect(page.getByRole('contentinfo')).toBeAttached();
    expect(pageErrors).toEqual([]);
  });
}
