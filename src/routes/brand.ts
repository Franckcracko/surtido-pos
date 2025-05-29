import { Router } from "express";
import { getBrands, createBrand, getBrandById, deleteBrand, updateBrandStatus } from "../controllers/brands.js"

const brandRouter = Router()

brandRouter.get('/', getBrands)
brandRouter.get('/:id', getBrandById)
brandRouter.post('/', createBrand)
brandRouter.delete('/:id', deleteBrand)
brandRouter.patch('/:id/status', updateBrandStatus)

export default brandRouter