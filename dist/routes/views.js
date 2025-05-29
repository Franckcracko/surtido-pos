import { Router } from "express";
import { validateAuthMiddleware } from "../middlewares/validate-auth.js";
import { ClientModel } from "../models/client.js";
import { TAKE } from "../constants.js";
import { BrandModel } from "../models/brand.js";
import { CategoryModel } from "../models/category.js";
import { ProductModel } from "../models/product.js";
import { OrderModel } from "../models/order.js";
const viewsRouter = Router();
viewsRouter.get('/', (req, res) => {
    res.render('index');
});
viewsRouter.get('/dashboard', validateAuthMiddleware, async (req, res) => {
    const totalClients = await ClientModel.countTotalClients();
    const totalOrders = await OrderModel.countTotalOrders();
    const totalSales = await OrderModel.countTotalSales();
    const topSellingProducts = await ProductModel.topSellingProducts(5);
    res.render('dashboard', { user: req.session?.user, totalClients, totalSales, totalOrders, topSellingProducts });
});
viewsRouter.get('/dashboard/categories', validateAuthMiddleware, async (req, res) => {
    const { name } = req.query;
    try {
        const categories = await CategoryModel.getAll(name?.toString());
        res.render('categories', { user: req.session?.user, categories, name: name?.toString() });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
viewsRouter.get('/dashboard/categories/add', validateAuthMiddleware, (req, res) => {
    res.render('category-add', { user: req.session?.user });
});
viewsRouter.get('/dashboard/customers', validateAuthMiddleware, async (req, res) => {
    const { page = 1, take = TAKE, name } = req.query;
    try {
        const { clients, totalPages } = await ClientModel.getAll(Number(page), Number(take), name?.toString());
        res.render('customers', { user: req.session?.user, clients, page, totalPages, name: name?.toString() });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
viewsRouter.get('/dashboard/brands', validateAuthMiddleware, async (req, res) => {
    const { name } = req.query;
    try {
        const { brands } = await BrandModel.getAll(name?.toString());
        res.render('brands', { user: req.session?.user, brands, name: name?.toString() });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
viewsRouter.get('/dashboard/inventory', validateAuthMiddleware, async (req, res) => {
    const { page = 1, take = TAKE, name, category } = req.query;
    try {
        const { products, totalPages } = await ProductModel.getAll(Number(page), Number(take), name?.toString(), category?.toString());
        const { brands } = await BrandModel.getAll();
        const categories = await CategoryModel.getAll();
        const totalProducts = await ProductModel.countTotalProducts();
        const lowStockProducts = await ProductModel.countTotalProductsLowStock();
        const outOfStockProducts = await ProductModel.countTotalProductsOutOfStock();
        res.render('inventory', {
            user: req.session?.user,
            products,
            page,
            totalPages,
            name: name?.toString(),
            totalProducts,
            lowStockProducts,
            outOfStockProducts,
            categories,
            brands
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
viewsRouter.get('/dashboard/orders', validateAuthMiddleware, async (req, res) => {
    const { search } = req.query;
    const orders = await OrderModel.getAll(search?.toString());
    try {
        res.render('orders', {
            user: req.session?.user,
            orders
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
viewsRouter.get('/dashboard/orders/add', validateAuthMiddleware, async (req, res) => {
    try {
        const clients = await ClientModel.getAllWithoutPagination();
        const categories = await CategoryModel.getAllActive();
        res.render('order-add', { user: req.session?.user, clients, categories });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
viewsRouter.get('/dashboard/config', validateAuthMiddleware, (req, res) => {
    res.render('config', { user: req.session?.user });
});
export default viewsRouter;
