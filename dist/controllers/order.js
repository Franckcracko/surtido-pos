import PDFDocument from 'pdfkit';
import { OrderModel } from "../models/order.js";
export const createOrder = async (req, res) => {
    const { clientId, orderItems, paidAmount } = req.body;
    try {
        const id = await OrderModel.createOrder({ clientId, orderItems, paidAmount });
        res.status(201).json({ id });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getOrders = async (req, res) => {
    try {
        const { search } = req.query;
        const orders = await OrderModel.getAll(search?.toString());
        res.status(200).json(orders);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await OrderModel.getById(id);
        if (!order) {
            res.status(404).json({ error: "Order not found" });
            return;
        }
        res.status(200).json(order);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getOrderReport = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await OrderModel.getById(id);
        if (!order) {
            res.status(404).json({ error: "Order report not found" });
            return;
        }
        const doc = new PDFDocument();
        // Encabezados HTTP para descargar el archivo
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=reporte_${order.id}.pdf`);
        doc.pipe(res);
        // ENCABEZADO
        doc.fontSize(20).text('Reporte de Pedido', { align: 'center' });
        doc.moveDown();
        // INFORMACIÓN DEL CLIENTE Y PEDIDO
        doc.fontSize(12);
        doc.text(`Pedido ID: ${order.id}`);
        doc.text(`Cliente: ${order.client.name}`);
        doc.text(`Teléfono: ${order.client.phone}`);
        doc.text(`Fecha: ${order.created_at.toLocaleString()}`);
        doc.text(`Estado: ${order.status}`);
        doc.moveDown();
        // TABLA DE PRODUCTOS
        doc.fontSize(14).text('Productos:', { underline: true });
        doc.moveDown(0.5);
        // Dibujar encabezados
        const tableTop = doc.y;
        const itemSpacing = 20;
        doc
            .fontSize(12)
            .text('ID', 50, tableTop)
            .text('Producto', 100, tableTop)
            .text('Cantidad', 300, tableTop)
            .text('Total', 400, tableTop);
        doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke(); // línea separadora
        // Dibujar filas
        let y = tableTop + 25;
        order.order_items.forEach((item, index) => {
            doc
                .fontSize(10)
                .text(item.id.toString(), 50, y)
                .text(item.name, 100, y)
                .text(item.quantity.toFixed(2), 300, y)
                .text(`$${(item.price * item.quantity).toFixed(2)}`, 400, y);
            y += itemSpacing;
        });
        // RESUMEN DE PAGO
        doc.moveDown(2);
        doc.fontSize(12).text(`Total: $${order.total_amount.toFixed(2)}`);
        doc.text(`Pagado: $${order.paid.toFixed(2)}`);
        doc.text(`Adeudo: $${order.due.toFixed(2)}`);
        doc.end();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getOrderReports = async (req, res) => {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
        res.status(400).json({ error: "Start date and end date are required" });
        return;
    }
    try {
        // Validar formato de fecha
        const start = new Date(startDate.toString());
        start.setUTCHours(0, 0, 0);
        const end = new Date(endDate.toString());
        end.setUTCHours(23, 59, 59);
        const orders = await OrderModel.getReports(start, end);
        if (!orders.length) {
            res.status(404).json({ error: 'No se encontraron pedidos en ese rango de fechas' });
            return;
        }
        const doc = new PDFDocument({ margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=reporte_${startDate}_a_${endDate}.pdf`);
        doc.pipe(res);
        doc.fontSize(18).text(`Reporte de Pedidos`, { align: 'center' });
        doc.fontSize(12).text(`Desde: ${startDate}  Hasta: ${endDate}`, { align: 'center' });
        doc.moveDown(2);
        for (const order of orders) {
            doc.fontSize(11).text(`Pedido: ${order.id}`, { underline: true });
            doc.fontSize(11).text(`Cliente: ${order.client.name} - Tel: ${order.client.phone}`);
            doc.text(`Fecha: ${order.created_at.toLocaleString()} - Estado: ${order.status}`);
            doc.moveDown(0.5);
            // Tabla
            const tableTop = doc.y;
            const itemSpacing = 20;
            doc
                .fontSize(11)
                .text('ID', 50, tableTop)
                .text('Producto', 100, tableTop)
                .text('Cantidad', 300, tableTop)
                .text('Total', 400, tableTop);
            doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
            let y = tableTop + 25;
            order.order_items.forEach(item => {
                doc
                    .fontSize(10)
                    .text(item.id.toString(), 50, y)
                    .text(item.name, 100, y)
                    .text(item.quantity.toFixed(2), 300, y)
                    .text(`$${(item.price * item.quantity).toFixed(2)}`, 400, y);
                y += itemSpacing;
                if (y > 700) {
                    doc.addPage();
                    y = 50;
                }
            });
            doc.moveDown();
            doc.fontSize(11).text(`Total: $${order.total_amount.toFixed(2)}`);
            doc.text(`Pagado: $${order.paid.toFixed(2)}`);
            doc.text(`Adeudo: $${order.due.toFixed(2)}`);
            doc.moveDown(2);
            if (doc.y > 700)
                doc.addPage();
        }
        doc.end();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getOverview = async (req, res) => {
    // Esta función obtiene un resumen de las ventas
    const { mode } = req.query;
    try {
        const overview = await OrderModel.getSalesOverview(mode?.toString());
        res.status(200).json(overview);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};
export const deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        await OrderModel.delete(id);
        res.status(200);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const paidOrder = async (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;
    if (!amount) {
        res.status(400).json({ error: "Amount is required" });
        return;
    }
    try {
        const order = await OrderModel.paid(id, amount);
        res.status(200).json(order);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
