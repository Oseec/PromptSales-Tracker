// src/utils/discounts.ts

export type CustomerType = "regular" | "vip" | "employee";

export function calculateDiscount(
  amount: number,
  customerType: CustomerType,
): number {
  if (amount < 0) {
    throw new Error("Amount cannot be negative");
  }

  if (customerType === "employee") {
    // 20 % descuento
    return +(amount * 0.8).toFixed(2);
  }

  if (customerType === "vip") {
    // 10 % descuento
    return +(amount * 0.9).toFixed(2);
  }

  // regular: sin descuento
  return amount;
}

export function hasAnyDiscount(customerType: CustomerType): boolean {
  return customerType === "vip" || customerType === "employee";
}
