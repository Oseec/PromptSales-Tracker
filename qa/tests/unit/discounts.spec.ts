// qa/tests/unit/discounts.spec.ts
import {
  calculateDiscount,
  hasAnyDiscount,
} from "../../../src/utils/discounts";

describe("discounts utils", () => {
  test("calculateDiscount aplica descuento a clientes vip", () => {
    expect(calculateDiscount(100, "vip")).toBe(90);
  });

  test("calculateDiscount deja igual al cliente regular", () => {
    expect(calculateDiscount(100, "regular")).toBe(100);
  });

  // Ojo: no probamos employee ni amount negativo

  test("hasAnyDiscount detecta clientes con descuento", () => {
    expect(hasAnyDiscount("vip")).toBe(true);
    expect(hasAnyDiscount("employee")).toBe(true);
  });
});
