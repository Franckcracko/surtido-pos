import { ProductModel } from "../models/product.js";
import { TAKE } from "../constants.js";
export const getProducts = async (req, res) => {
    const { page = 1, take = TAKE, name, category } = req.query;
    try {
        const products = await ProductModel.getAll(Number(page), Number(take), name?.toString(), category?.toString());
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
};
export const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await ProductModel.getById(id);
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const createProduct = async (req, res) => {
    const { name, price, categoryId, brandId, stock, lowStock } = req.body;
    const image = req.file?.filename;
    try {
        const id = await ProductModel.create({ name, price: +price, categoryId: +categoryId, brandId: +brandId, image, stock: +stock, lowStock: +lowStock });
        res.status(201).json({ id });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, categoryId, brandId, stock, lowStock, status } = req.body;
    const image = req.file?.filename;
    try {
        const product = await ProductModel.update(id, { status, name, image, price: +price || undefined, categoryId: +categoryId || undefined, brandId: +brandId || undefined, stock: +stock || undefined, lowStock: +lowStock || undefined });
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getProductByCategory = async (req, res) => {
    const { id } = req.params;
    const { status } = req.query;
    try {
        const products = await ProductModel.getByCategoryId(+id, status && status.toString().toUpperCase());
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
