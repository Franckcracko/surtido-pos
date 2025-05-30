import { Router, json } from "express";
import { validateAuthMiddleware } from "../middlewares/validate-auth.js";

import authRouter from "./auth.js";
import brandRouter from "./brand.js";
import categoryRouter from "./category.js";
import clientRouter from "./client.js";
import productRouter from "./product.js";
import orderRouter from "./order.js";

const indexRouter = Router()

indexRouter.use('/auth', json(), authRouter)
indexRouter.use('/brands', json(), validateAuthMiddleware, brandRouter)
indexRouter.use('/categories', json(), validateAuthMiddleware, categoryRouter)
indexRouter.use('/clients', json(), validateAuthMiddleware, clientRouter)
indexRouter.use('/orders', json(), validateAuthMiddleware, orderRouter)
indexRouter.use('/products', productRouter)

export default indexRouter