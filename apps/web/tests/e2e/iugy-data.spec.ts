import { expect, test, type Page } from '@playwright/test';

test.use({ contextOptions: { reducedMotion: 'reduce' } });

test('renders official IUGY data from five parallel public requests', async ({
  page,
}) => {
  const calls = await mockIugyApi(page);

  await page.goto('/instituicoes/iugy');

  await expect(
    page.getByRole('heading', { level: 3, name: 'Nível Técnico' }),
  ).toBeVisible();
  await expect(page.getByText('Admissão pública')).toBeVisible();
  await expect(page.getByText('Abertura acadêmica')).toBeVisible();
  await expect(
    page.locator('.iugy-calendar__cycle', { hasText: 'Ciclo 1988' }),
  ).toBeVisible();

  await expect.poll(() => totalCalls(calls)).toBe(5);
  expect([...calls.values()]).toStrictEqual([1, 1, 1, 1, 1]);
});

test('keeps navigation and healthy sections available during a partial failure', async ({
  page,
}) => {
  const calls = await mockIugyApi(page, { failProgramsOnce: true });

  await page.goto('/instituicoes/iugy');

  const error = page.getByRole('alert', {
    name: 'Não foi possível carregar as formações.',
  });
  await expect(error).toBeVisible();
  await expect(page.getByRole('button', { name: /menu/i })).toBeVisible();
  await expect(page.getByText('Admissão pública')).toBeVisible();
  await expect(page.getByText('Abertura acadêmica')).toBeVisible();

  await error.getByRole('button', { name: 'Tentar novamente' }).click();

  await expect(
    page.getByRole('heading', { level: 3, name: 'Nível Técnico' }),
  ).toBeVisible();
  expect(calls.get('/api/v1/iugy/programs')).toBe(2);
  expect(totalCalls(calls)).toBe(6);
});

test('keeps loaded IUGY content inside a 320 px viewport', async ({ page }) => {
  await mockIugyApi(page);
  await page.setViewportSize({ height: 720, width: 320 });
  await page.goto('/instituicoes/iugy');

  await expect(
    page.getByRole('heading', { level: 3, name: 'Nível Técnico' }),
  ).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );

  expect(overflow).toBeLessThanOrEqual(1);
});

type MockIugyApiOptions = {
  failProgramsOnce?: boolean;
};

async function mockIugyApi(
  page: Page,
  { failProgramsOnce = false }: MockIugyApiOptions = {},
) {
  const calls = new Map<string, number>();

  await page.route('**/api/v1/iugy**', async (route) => {
    const path = new URL(route.request().url()).pathname;
    const count = (calls.get(path) ?? 0) + 1;
    calls.set(path, count);

    if (failProgramsOnce && path.endsWith('/programs') && count === 1) {
      await route.fulfill({
        contentType: 'application/json',
        json: { error: { code: 'INTERNAL_ERROR' } },
        status: 503,
      });
      return;
    }

    await route.fulfill({
      contentType: 'application/json',
      json: responseFor(path),
      status: 200,
    });
  });

  return calls;
}

function responseFor(path: string) {
  if (path.endsWith('/programs')) {
    return {
      data: [
        {
          description: 'Formação estatal.',
          displayOrder: 1,
          externalReference: 'Referência pública',
          id: '00000000-0000-4000-8000-000000002001',
          levelCode: 'I',
          publishedAt: '1988-02-01T00:00:00.000Z',
          title: 'Nível Técnico',
        },
      ],
      pagination: pagination(1),
    };
  }

  if (path.endsWith('/notices')) {
    return {
      data: [
        {
          code: 'IUGY-1988/001',
          formationId: '00000000-0000-4000-8000-000000002001',
          id: '00000000-0000-4000-8000-000000003001',
          levelLabel: 'Nível Técnico',
          periodLabel: 'Ciclo 1988 · Período I',
          publishedAt: '1988-02-01T00:00:00.000Z',
          selectionCycleId: '00000000-0000-4000-8000-000000001988',
          status: 'aberto',
          title: 'Admissão pública',
        },
      ],
      pagination: pagination(1),
    };
  }

  if (path.endsWith('/selection-cycles/current')) {
    return {
      data: {
        cycleNumber: 1988,
        id: '00000000-0000-4000-8000-000000001988',
        periodLabel: 'Ciclo 1988',
        publishedAt: '1988-02-01T00:00:00.000Z',
        title: 'Ciclo 1988',
      },
    };
  }

  if (path.endsWith('/events')) {
    return {
      data: [
        {
          description: 'Recepção e primeiros módulos.',
          displayOrder: 1,
          id: '00000000-0000-4000-8000-000000005001',
          periodLabel: 'Ciclo 1988 · Período I',
          publishedAt: '1988-02-01T00:00:00.000Z',
          selectionCycleId: '00000000-0000-4000-8000-000000001988',
          title: 'Abertura acadêmica',
        },
      ],
      pagination: pagination(1),
    };
  }

  return {
    data: {
      acronym: 'IUGY',
      description: 'Universidade pública de Yppon.',
      id: '00000000-0000-4000-8000-000000000001',
      name: 'Instituto Universitário Geral de Yppon',
      publishedAt: '1988-02-01T00:00:00.000Z',
      slug: 'iugy',
    },
  };
}

function pagination(totalItems: number) {
  return {
    page: 1,
    pageSize: 100,
    totalItems,
    totalPages: totalItems === 0 ? 0 : 1,
  };
}

function totalCalls(calls: Map<string, number>) {
  return [...calls.values()].reduce((total, count) => total + count, 0);
}
