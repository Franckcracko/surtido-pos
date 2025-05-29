import { Router } from "express";
import { createCategory, deleteCategory, getCategories, getCategoryById, updateCategoryStatus } from "../controllers/category.js"

const categoryRouter = Router()

categoryRouter.get('/', getCategories)
categoryRouter.get('/:id', getCategoryById)
categoryRouter.patch('/:id/status', updateCategoryStatus)
categoryRouter.post('/', createCategory)
categoryRouter.delete('/:id', deleteCategory)

export default categoryRouter