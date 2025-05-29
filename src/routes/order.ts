import { Router } from "express";
import { createOrder, getOrders, getOrderById,paidOrder,deleteOrder, getOrderReport, getOrderReports, getOverview } from "../controllers/order.js";

const orderRouter = Router()

orderRouter.post("/", createOrder)
orderRouter.get("/", getOrders)
orderRouter.get("/sales-overview", getOverview)
orderRouter.get("/reports", getOrderReports)
orderRouter.delete("/:id", deleteOrder)
orderRouter.get("/:id", getOrderById)
orderRouter.get("/:id/report", getOrderReport)
orderRouter.post("/:id/paid", paidOrder)

export default orderRouter