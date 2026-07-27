import { expect, test } from '@playwright/test';

test.use({ contextOptions: { reducedMotion: 'reduce' } });

const routes = [
  {
    heading: /a ordem\s*sustenta\s*o progresso/i,
    path: '/',
  },
  {
    heading: /conhecimento\s*é soberania/i,
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
        const criticalElements = Array.from(
          document.querySelectorAll<HTMLElement>(
            [
              'main h1',
              'main h2',
              'main h3',
              '.institution-panels',
              '.institution-panel',
              '.institution-panel__copy',
              '.institution-panel__description',
            ].join(','),
          ),
        ).map((element) => {
          const bounds = element.getBoundingClientRect();

          return {
            enforceScrollWidth: element.matches(
              '.institution-panels, .institution-panel',
            ),
            label:
              element.getAttribute('class') ??
              `${element.tagName.toLowerCase()}: ${element.textContent?.trim().slice(0, 40)}`,
            left: bounds.left,
            right: bounds.right,
            scrollOverflow: element.scrollWidth - element.clientWidth,
          };
        });

        return {
          criticalElements,
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

      for (const element of layout.criticalElements) {
        expect
          .soft(element.left, `${element.label} starts outside the viewport`)
          .toBeGreaterThanOrEqual(-1);
        expect
          .soft(element.right, `${element.label} ends outside the viewport`)
          .toBeLessThanOrEqual(layout.viewportWidth + 1);
        if (element.enforceScrollWidth) {
          expect
            .soft(element.scrollOverflow, `${element.label} clips its contents`)
            .toBeLessThanOrEqual(1);
        }
      }
    });
  }
}
