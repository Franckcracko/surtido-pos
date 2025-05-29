import z from "zod";
export const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.number().min(0, "Price must be greater than 0"),
    categoryId: z.number().min(1, "Category ID is required"),
    stock: z.number().min(1, "Stock must be greater than 0"),
    brandId: z.number().min(1, "Brand ID is required"),
    lowStock: z.number().min(1, "Low stock must be greater than 0"),
    image: z.string().optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});
export function validateProduct(input) {
    return productSchema.safeParse(input);
}
export function validatePartialProduct(input) {
    return productSchema.partial().safeParse(input);
}
