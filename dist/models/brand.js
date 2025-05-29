import { prisma } from "../lib/prisma.js";
export class BrandModel {
    static async create({ name }) {
        if (!name)
            throw new Error('Name is required');
        if (name.length < 3)
            throw new Error('Name must be at least 3 characters long');
        const brand = await prisma.brands.findFirst({ where: { name } });
        if (brand)
            throw new Error('Brand already exists');
        const { id } = await prisma.brands.create({
            data: {
                name: name,
                status: 1
            }
        });
        return id;
    }
    static async getAll(name) {
        const brands = await prisma.brands.findMany({
            orderBy: {
                name: 'asc'
            },
            where: {
                name: {
                    contains: name,
                }
            }
        });
        return {
            brands,
        };
    }
    static async getById(id) {
        const brand = await prisma.brands.findUnique({ where: { id } });
        if (!brand)
            throw new Error('Brand not found');
        return brand;
    }
    static async updateStatus(id, { status }) {
        const brand = await prisma.brands.findUnique({ where: { id } });
        if (!brand)
            throw new Error('Brand not found');
        if (brand.status === status)
            throw new Error('Brand already has this status');
        if (status !== 0 && status !== 1)
            throw new Error('Invalid status');
        const updatedBrand = await prisma.brands.update({
            where: { id },
            data: {
                status,
            }
        });
        return updatedBrand;
    }
    static async delete(id) {
        const brand = await prisma.brands.findUnique({ where: { id } });
        if (!brand)
            throw new Error('Brand not found');
        await prisma.products.deleteMany({ where: { brand_id: id } });
        await prisma.brands.delete({ where: { id } });
        return brand;
    }
}
