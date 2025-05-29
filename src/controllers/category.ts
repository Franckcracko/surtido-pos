import { Request, Response } from 'express';
import { CategoryModel } from '../models/category.js';

export const createCategory = async (req: Request, res: Response) => {
  const { name, description } = req.body;

  try {
    const id = await CategoryModel.create({ name, description });

    res.status(201).json({ id });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  const { name } = req.query;
  try {
    const categories = await CategoryModel.getAll(name?.toString());

    res.status(200).json(categories);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const category = await CategoryModel.getById(Number(id));

    res.status(200).json(category);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await CategoryModel.delete(Number(id));

    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateCategoryStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const category = await CategoryModel.updateStatus(Number(id), { status });

    res.status(200).json(category);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};