import { expect, test } from '@playwright/test';

const routes = [
  {
    heading: /a ordem sustenta\s*o progresso/i,
    path: '/',
  },
  {
    heading: /a formação que\s*sustenta o estado/i,
    path: '/instituicoes/iugy',
  },
];

const viewports = [
  { height: 720, name: '320 px', width: 320 },
  { height: 1024, name: 'tablet', width: 768 },
  { height: 900, name: 'desktop', width: 1440 },
];

for (const route of routes) {
  for (const viewport of viewports) {
    test(`${route.path} fits the ${viewport.name} layout`, async ({ page }) => {
      await page.setViewportSize({
        height: viewport.height,
        width: viewport.width,
      });
      await page.goto(route.path);

      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toContainText(route.heading);
      await expect(page.getByRole('button', { name: /menu/i })).toBeVisible();

      const layout = await page.evaluate(() => {
        const headingBounds = document.querySelector('h1')!.getBoundingClientRect();

        return {
          headingLeft: headingBounds.left,
          headingRight: headingBounds.right,
          viewportWidth: window.innerWidth,
          viewportOverflow:
            document.documentElement.scrollWidth - document.documentElement.clientWidth,
        };
      });

      expect(layout.viewportOverflow).toBeLessThanOrEqual(1);
      expect(layout.headingLeft).toBeGreaterThanOrEqual(-1);
      expect(layout.headingRight).toBeLessThanOrEqual(layout.viewportWidth + 1);
    });
  }
}
