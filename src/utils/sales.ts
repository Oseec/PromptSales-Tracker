export type PaymentMethod = "cash" | "card" | "transfer";

export function calculateTotalWithTax(
  baseAmount: number,
  taxRate: number,
): number {
  if (baseAmount < 0) throw new Error("Base amount cannot be negative");
  if (taxRate < 0) throw new Error("Tax rate cannot be negative");
  return +(baseAmount * (1 + taxRate)).toFixed(2);
}

export function isHighValueSale(amount: number, threshold = 1000): boolean {
  return amount >= threshold;
}

export function isValidPaymentMethod(method: string): method is PaymentMethod {
  return method === "cash" || method === "card" || method === "transfer";
}
