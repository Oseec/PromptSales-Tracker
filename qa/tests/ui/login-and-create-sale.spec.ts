import { test, expect } from '@playwright/test'

test('create sale successfully from dashboard', async ({ page }) => {
  await page.goto('/dashboard')

  // Llenar formulario de venta
  await page.getByLabel('Cliente').fill('Cliente Test')
  await page.getByLabel('Monto').fill('25')

  // Abrir el select de método de pago y elegir "Efectivo"
  await page.getByText('Selecciona método').click()
  await page.getByRole('option', { name: 'Efectivo' }).first().click()

  // Click en el botón "Crear Venta"
  await page.getByRole('button', { name: /crear venta/i }).click()

  // Verificar el toast de éxito (forzamos un solo elemento)
  await expect(
    page.getByText(/¡Venta creada!/).first(),
  ).toBeVisible()

  await expect(
    page.getByText(/Venta de \$25/).first(),
  ).toBeVisible()
})
