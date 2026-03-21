import { _electron as electron, expect, test } from '@playwright/test';

test('launches the built desktop shell', async () => {
  test.setTimeout(120_000);

  const app = await electron.launch({
    args: ['.'],
  });
  const window = await app.firstWindow();

  await window.waitForLoadState('domcontentloaded');
  await expect(window.locator('.desktop-shell')).toBeVisible();
  await expect(window.getByText('Control Center')).toBeVisible();
  await expect(window.getByTestId('dock-item-finder')).toBeVisible();

  await app.close();
});
