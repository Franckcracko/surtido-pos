import { prisma } from "../lib/prisma.js";
import { validatePartialProduct, validateProduct } from "../schemas/product.js";
import { deleteImageFiles } from "../utils/delete-image-files.js";
export class ProductModel {
    static async create(data) {
        const { error, data: parsedData } = validateProduct(data);
        if (error)
            throw new Error(error.message);
        const { name, price, categoryId, brandId, stock, lowStock, image } = parsedData;
        const product = await prisma.products.findFirst({ where: { AND: [{ name }, { category_id: categoryId }] } });
        if (product)
            throw new Error('Product already exists');
        const { id } = await prisma.products.create({
            data: {
                name,
                price,
                category_id: categoryId,
                status: 'ACTIVE',
                brand_id: brandId,
                image,
                stock,
                low_stock: lowStock,
            }
        });
        return id;
    }
    static async update(id, data) {
        const { error, data: parsedData } = validatePartialProduct(data);
        if (error)
            throw new Error(error.message);
        const { name, price, categoryId, brandId, image, stock, lowStock, status } = parsedData;
        const product = await prisma.products.findUnique({ where: { id } });
        if (!product)
            throw new Error('Product not found');
        if (name && name !== product.name) {
            const existingProduct = await prisma.products.findFirst({
                where: { AND: [{ name }, { category_id: categoryId }] }
            });
            if (existingProduct)
                throw new Error('Product with this name already exists in the same category');
        }
        if (status && status !== product.status) {
            if (!['ACTIVE', 'INACTIVE'].includes(status))
                throw new Error('Invalid status');
        }
        if (categoryId && categoryId !== product.category_id) {
            const existingCategory = await prisma.categories.findUnique({ where: { id: categoryId } });
            if (!existingCategory)
                throw new Error('Category not found');
        }
        if (brandId && brandId !== product.brand_id) {
            const existingBrand = await prisma.brands.findUnique({ where: { id: brandId } });
            if (!existingBrand)
                throw new Error('Brand not found');
        }
        if (image && product.image && image !== product.image) {
            deleteImageFiles(product.image); // Eliminar la imagen anterior si existe
        }
        const updatedProduct = await prisma.products.update({
            where: { id },
            data: {
                name,
                price,
                category_id: categoryId,
                brand_id: brandId,
                image,
                stock,
                low_stock: lowStock,
                status: status || product.status // Mantener el estado anterior si no se proporciona uno nuevo
            }
        });
        return updatedProduct;
    }
    static async getAll(page, take, name, category) {
        if (page < 1 || take < 1)
            throw new Error('Invalid page or take value');
        const where = {};
        if (name) {
            where.name = {
                contains: name,
            };
        }
        if (category && category !== 'all' && !isNaN(+category)) {
            console.log(category);
            where.category_id = +category;
        }
        console.log(`Fetching products with page: ${page}, take: ${take}, name: ${name}, category: ${category}`);
        const products = await prisma.products.findMany({
            take,
            orderBy: {
                name: 'asc'
            },
            skip: (page - 1) * take,
            where,
            include: {
                category: true,
                brand: true
            }
        });
        return {
            products,
            totalPages: Math.ceil(await prisma.products.count() / take),
            page
        };
    }
    static async getById(id) {
        const product = await prisma.products.findUnique({ where: { id }, include: { category: true } });
        if (!product)
            throw new Error('Product not found');
        return product;
    }
    static async getByCategoryId(categoryId, status) {
        const where = { category_id: categoryId };
        if (status) {
            where.status = status;
        }
        const products = await prisma.products.findMany({
            where
        });
        return products;
    }
    static async delete(id) {
        const product = await prisma.products.findUnique({ where: { id } });
        if (!product)
            throw new Error('Product not found');
        await prisma.products.delete({ where: { id } });
    }
    static async topSellingProducts(take) {
        if (take < 1)
            throw new Error('Invalid take value');
        // las ventas se obtienen a través de las órdenes
        const orders = await prisma.orders.findMany({
            where: {
                status: 'PAID'
            },
            include: {
                order_items: {
                    include: {
                        product: true
                    }
                }
            }
        });
        const productSales = {};
        orders.forEach(order => {
            order.order_items.forEach(item => {
                if (productSales[item.product.id]) {
                    productSales[item.product.id] += item.quantity;
                }
                else {
                    productSales[item.product.id] = item.quantity;
                }
            });
        });
        const sortedProducts = Object.entries(productSales)
            .sort((a, b) => b[1] - a[1])
            .slice(0, take)
            .map(([productId, quantity]) => ({ productId, quantity }));
        const productIds = sortedProducts.map(item => item.productId);
        const products = await prisma.products.findMany({
            where: {
                id: { in: productIds }
            },
            include: {
                category: true,
                brand: true
            }
        });
        return products.map(product => {
            const sale = sortedProducts.find(item => item.productId === product.id);
            return {
                ...product,
                quantity: sale ? sale.quantity : 0
            };
        });
    }
    static async countTotalProducts() {
        const total = await prisma.products.count();
        return total;
    }
    static async countTotalProductsLowStock() {
        const products = await prisma.products.findMany();
        const total = products.filter(product => {
            return product.stock <= product.low_stock && product.status === 'ACTIVE' && product.stock > 0;
        }).length;
        return total;
    }
    static async countTotalProductsOutOfStock() {
        const products = await prisma.products.findMany({
            where: {
                stock: 0,
                status: 'ACTIVE'
            }
        });
        return products.length;
    }
}
