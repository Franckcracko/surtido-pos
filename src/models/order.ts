import { prisma } from "../lib/prisma.js"
import { orderSchema } from "../schemas/order.js"
import { endOfWeek, format, startOfMonth, endOfMonth, eachWeekOfInterval } from 'date-fns';
import { es } from 'date-fns/locale/es'
export class OrderModel {
  static async createOrder(data: unknown) {
    const parsedData = orderSchema.safeParse(data)

    if (!parsedData.success) {
      throw new Error("Invalid order data")
    }

    const { clientId, orderItems, paidAmount } = parsedData.data
    const items = await Promise.all(orderItems.map(async (item) => {
      const product = await prisma.products.findUnique({
        where: { id: item.productId },
      })

      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`)
      }
      
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.productId}`)
      }

      await prisma.products.update({
        where: { id: item.productId },
        data: {
          stock: product.stock - item.quantity,
        },
      })

      return {
        ...product,
        quantity: item.quantity,
      }
    }))

    const totalAmount = items.reduce((acc, item) => {
      const price = item.price * item.quantity
      return acc + price
    }, 0)

    const { id } = await prisma.orders.create({
      data: {
        due: totalAmount - (paidAmount || 0),
        paid: paidAmount || 0,
        client_id: clientId,
        status: paidAmount ? (totalAmount <= paidAmount ? "PAID" : "PENDING") : "PENDING",
        total_amount: totalAmount,
        order_items: {
          createMany: {
            data: items.map((product) => ({
              product_id: product.id,
              quantity: product.quantity,
              name: product.name,
              price: product.price,
            })),
          }
        },
      },
    })

    return id
  }

  static async getAll(search?: string) {
    const where = search ? {
      OR: [
        {
          client: {
            name: {
              contains: search?.toString(),
            },
          }
        },
        {
          id: {
            contains: search?.toString(),
          },
        },
      ]
    } : {};

    const orders = await prisma.orders.findMany({
      include: {
        order_items: true,
        client: true,
      },
      where: {
        deleted: false,
        ...where,
      },
      orderBy: {
        created_at: 'desc',
      },
    })
    return orders
  }

  static async getReports(startDate: Date, endDate: Date) {
    const orders = await prisma.orders.findMany({
      where: {
        created_at: {
          gte: startDate,
          lte: endDate,
        }
      },
      include: {
        order_items: true,
        client: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    })
    return orders
  }

  static async getById(id: string) {
    const order = await prisma.orders.findUnique({
      where: { id },
      include: {
        order_items: {
          include: {
            product: true
          }
        },
        client: true,
      },
    })
    if (!order) {
      throw new Error(`Order with ID ${id} not found`)
    }
    return order
  }

  static async paid(id: string, amount: number) {
    const order = await prisma.orders.findUnique({
      where: { id },
    })

    if (!order) {
      throw new Error(`Order with ID ${id} not found`)
    }

    if (order.status === "PAID") {
      throw new Error(`Order with ID ${id} is already paid`)
    }

    if (amount <= 0) {
      throw new Error(`Invalid amount: ${amount}`)
    }

    await prisma.orders.update({
      where: { id },
      data: {
        paid: order.paid + amount,
        due: order.due - amount,
        status: order.total_amount <= (order.paid + amount) ? "PAID" : "PENDING",
      },
    })
    return order
  }

  static async getSalesOverview(mode = 'day') {
    if (!['daily', 'weekly', 'monthly'].includes(mode)) {
      throw new Error("Invalid mode. Use 'daily', 'weekly', or 'monthly'");
    }

    const allOrders = await prisma.orders.findMany({
      where: { status: 'PAID', deleted: false },
      select: {
        total_amount: true,
        created_at: true
      }
    });

    const grouped: Record<string, number> = {};

    if (mode === 'daily') {
      // Agrupar por día de la semana (lunes a domingo)
      const weekDays = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
      for (let i = 0; i < 7; i++) {
        grouped[weekDays[i]] = 0;
      }

      allOrders.forEach(order => {
        const day = format(order.created_at, 'eeee', { locale: es });
        grouped[day.toLowerCase()] += order.total_amount;
      });

    } else if (mode === 'weekly') {
      // Agrupar por semana del mes actual
      const now = new Date();
      const start = startOfMonth(now);
      const end = endOfMonth(now);
      const weeks = eachWeekOfInterval({ start, end }, { weekStartsOn: 1 });

      weeks.forEach((weekStart, i) => {
        const weekLabel = `Semana ${i + 1}`;
        grouped[weekLabel] = 0;

        const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

        allOrders.forEach(order => {
          if (order.created_at >= weekStart && order.created_at <= weekEnd) {
            grouped[weekLabel] += order.total_amount;
          }
        });
      });

    } else if (mode === 'monthly') {
      // Agrupar por mes de todos los pedidos
      allOrders.forEach(order => {
        const key = format(order.created_at, 'MMMM yyyy', { locale: es });
        if (!grouped[key]) grouped[key] = 0;
        grouped[key] += order.total_amount;
      });
    }
    const overview = Object.entries(grouped).map(([key, value]) => ({
      label: key,
      sales: value,
    }));
    return overview;
  }

  static async countTotalOrders() {
    const total = await prisma.orders.count({
      where: {
        deleted: false,
      },
    })
    return total
  }

  static async countTotalSales() {
    const total = await prisma.orders.aggregate({
      _sum: {
        total_amount: true,
      },
      where: {
        created_at: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
        deleted: false,
      },
    })
    return total._sum.total_amount || 0
  }

  static async delete(id: string) {
    const order = await prisma.orders.findUnique({
      where: { id },
      include: {
        order_items: true,
      },
    })

    if (!order) {
      throw new Error(`Order with ID ${id} not found`)
    }

    if (order.deleted) {
      throw new Error(`Order with ID ${id} is already deleted`)
    }

    await Promise.all(order.order_items.map(async (item) => {
      const product = await prisma.products.findUnique({
        where: { id: item.product_id },
      })
      if (product) {
        await prisma.products.update({
          where: { id: item.product_id },
          data: {
            stock: product.stock + item.quantity,
          },
        })
      }
    }))

    await prisma.orders.update({
      where: { id },
      data: {
        deleted: true
      }
    })
  }
}