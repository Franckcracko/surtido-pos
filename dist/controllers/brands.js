import { BrandModel } from "../models/brand.js";
export const createBrand = async (req, res) => {
    const { name } = req.body;
    try {
        const id = await BrandModel.create({ name });
        res.status(201).json({ id });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
};
export const getBrands = async (req, res) => {
    const { name } = req.query;
    try {
        const { brands } = await BrandModel.getAll(name?.toString());
        res.status(200).json(brands);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const getBrandById = async (req, res) => {
    const { id } = req.params;
    try {
        const brand = await BrandModel.getById(Number(id));
        res.status(200).json(brand);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const updateBrandStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const brand = await BrandModel.updateStatus(Number(id), { status });
        res.status(200).json(brand);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const deleteBrand = async (req, res) => {
    const { id } = req.params;
    try {
        await BrandModel.delete(Number(id));
        res.status(204).send();
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
