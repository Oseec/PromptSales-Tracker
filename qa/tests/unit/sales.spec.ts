// qa/tests/unit/sales.spec.ts
import {
  calculateTotalWithTax,
  isHighValueSale,
  isValidPaymentMethod,
} from "../../../src/utils/sales";

describe("sales utils", () => {
  test("calculateTotalWithTax calcula correctamente", () => {
    expect(calculateTotalWithTax(100, 0.13)).toBe(113);
  });

  test("calculateTotalWithTax lanza error con monto negativo", () => {
    expect(() => calculateTotalWithTax(-10, 0.13)).toThrow();
  });

  test("isHighValueSale identifica ventas de alto valor", () => {
    expect(isHighValueSale(1500)).toBe(true);
    expect(isHighValueSale(500)).toBe(false);
  });

  test("isValidPaymentMethod reconoce métodos válidos", () => {
    expect(isValidPaymentMethod("cash")).toBe(true);
    expect(isValidPaymentMethod("card")).toBe(true);
    expect(isValidPaymentMethod("transfer")).toBe(true);
    expect(isValidPaymentMethod("crypto")).toBe(false);
  });
});
