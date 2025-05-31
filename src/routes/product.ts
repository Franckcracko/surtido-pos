import { Router } from "express";
import { createProduct, getProductById, getProducts, updateProduct, getProductByCategory, deleteProduct } from "../controllers/products.js"
import { upload } from "../lib/multer.js";

const productRouter = Router()

productRouter.get('/', getProducts)
productRouter.get('/:id', getProductById)
productRouter.get('/category/:id', getProductByCategory)
productRouter.post('/', upload.single('image'), createProduct)
productRouter.put('/:id', upload.single('image'), updateProduct)
productRouter.delete('/:id', deleteProduct)

export default productRouter