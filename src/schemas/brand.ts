import z from "zod"

export const brandSchema = z.object({
  name: z.string().min(1, "Name is required"),
  status: z.number().int().min(0, "Status must be 0 or 1").max(1, "Status must be 0 or 1").optional(),
})

export function validateBrand (input: unknown) {
  return brandSchema.safeParse(input)
}

export function validatePartialBrand (input: unknown) {
  return brandSchema.partial().safeParse(input)
}