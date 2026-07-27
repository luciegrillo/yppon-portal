import { expect, test } from '@playwright/test';

test('keyboard users can skip content and operate the ceremonial menu', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('main#main-content')).toBeVisible();

  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: /pular para o conteúdo/i });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();

  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main-content$/);

  const menuTrigger = page.getByRole('button', { name: /menu/i });
  await menuTrigger.focus();
  await page.keyboard.press('Enter');

  const dialog = page.getByRole('dialog', { name: /navegação principal/i });
  const closeButton = page.getByRole('button', { name: /fechar menu/i });
  const lastLink = dialog.getByRole('link', {
    exact: true,
    name: 'Acesso Cidadão',
  });

  await expect(dialog).toBeVisible();
  await expect(closeButton).toBeFocused();

  await page.keyboard.press('Shift+Tab');
  await expect(lastLink).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(closeButton).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(menuTrigger).toBeFocused();
});

test.describe('reduced motion', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });

  test('keeps IUGY content available without continuous or smooth motion', async ({
    page,
  }) => {
    await page.goto('/instituicoes/iugy');

    await expect(page.locator('.iugy-hero__copy')).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.classList.contains('lenis')),
      )
      .toBe(false);

    const readMotionState = () =>
      page.evaluate(() => {
        const copy = document.querySelector<HTMLElement>('.iugy-hero__copy')!;
        const outerRing = document.querySelector<HTMLElement>(
          '.iugy-emblem-ring--outer',
        )!;
        const innerRing = document.querySelector<HTMLElement>(
          '.iugy-emblem-ring--inner',
        )!;

        return {
          copyInlineStyle: copy.getAttribute('style'),
          copyTransform: getComputedStyle(copy).transform,
          innerRingInlineStyle: innerRing.getAttribute('style'),
          innerRingTransform: getComputedStyle(innerRing).transform,
          mediaPreference: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
          outerRingAnimation: getComputedStyle(outerRing).animationName,
          outerRingInlineStyle: outerRing.getAttribute('style'),
          outerRingTransform: getComputedStyle(outerRing).transform,
          scrollCue: getComputedStyle(
            document.querySelector<HTMLElement>('.iugy-hero__scroll-cue')!,
          ).display,
        };
      });

    const initialMotionState = await readMotionState();
    await page.waitForTimeout(150);
    const settledMotionState = await readMotionState();

    expect(initialMotionState.mediaPreference).toBe(true);
    expect(initialMotionState.outerRingAnimation).toBe('none');
    expect(initialMotionState.scrollCue).toBe('none');
    expect(initialMotionState.copyInlineStyle).toBeNull();
    expect(initialMotionState.outerRingInlineStyle).toBeNull();
    expect(initialMotionState.innerRingInlineStyle).toBeNull();
    expect(settledMotionState).toEqual(initialMotionState);
  });
});
