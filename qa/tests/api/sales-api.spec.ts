import { test, expect } from "@playwright/test";

test("create sale via WebAPI", async ({ request }) => {
  const response = await request.post("http://localhost:4000/api/sales", {
    data: {
      customer: "Cliente API",
      amount: 150,
      paymentMethod: "tarjeta",
    },
  });

  expect(response.status()).toBe(201);
  const body = await response.json();

  // Validar shape de la respuesta
  expect(body).toMatchObject({
    customer: "Cliente API",
    amount: 150,
    paymentMethod: "tarjeta",
  });

  expect(body).toHaveProperty("id");
  expect(body).toHaveProperty("createdAt");
});
