import { Request, Response } from "express";
import { BrandModel } from "../models/brand.js";

export const createBrand = async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    const id = await BrandModel.create({ name });

    res.status(201).json({ id });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

export const getBrands = async (req: Request, res: Response) => {
  const { name } = req.query;

  try {
    const { brands } = await BrandModel.getAll(name?.toString());

    res.status(200).json(brands);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export const getBrandById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const brand = await BrandModel.getById(Number(id));

    res.status(200).json(brand);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export const updateBrandStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const brand = await BrandModel.updateStatus(Number(id), { status });

    res.status(200).json(brand);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export const deleteBrand = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await BrandModel.delete(Number(id));

    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}