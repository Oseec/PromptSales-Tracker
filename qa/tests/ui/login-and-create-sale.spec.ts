import { test, expect } from '@playwright/test';

test('create sale successfully from dashboard', async ({ page }) => {
  await page.goto('/dashboard')


  // Verifica que el dashboard cargó
  await expect(
    page.getByRole('button', { name: /nueva venta/i }),
  ).toBeVisible()

  // LLENAR FORM DE VENTA
  await page.getByLabel('Cliente').fill('Cliente Test');
  await page.getByLabel('Monto').fill('25');

  await page.getByText('Selecciona método').click();
  await page.getByRole('option', { name: 'Efectivo' }).click();

  await page.getByRole('button', { name: 'Crear Venta' }).click();

  await expect(page.getByText('¡Venta creada!')).toBeVisible();
  await expect(
    page.getByText('Venta de $25 registrada exitosamente').first()
  ).toBeVisible();
});
