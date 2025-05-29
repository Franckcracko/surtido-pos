import z from "zod"

export const orderSchema = z.object({
  clientId: z.number().min(1, "Client ID is required"),
  paidAmount: z.number().optional(),
  orderItems: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1, "Quantity must be greater than 0"),
    })
  ),
})

export function validateProduct (input: unknown) {
  return orderSchema.safeParse(input)
}

export function validatePartialProduct (input: unknown) {
  return orderSchema.partial().safeParse(input)
}