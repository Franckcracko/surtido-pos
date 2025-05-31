import { Router } from "express";
import { getBrands, createBrand, getBrandById, deleteBrand, updateBrand } from "../controllers/brands.js"

const brandRouter = Router()

brandRouter.get('/', getBrands)
brandRouter.get('/:id', getBrandById)
brandRouter.post('/', createBrand)
brandRouter.delete('/:id', deleteBrand)
brandRouter.put('/:id', updateBrand)

export default brandRouter