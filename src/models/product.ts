import { prisma } from "../lib/prisma.js"
import { validatePartialProduct, validateProduct } from "../schemas/product.js"
import { deleteImageFiles } from "../utils/delete-image-files.js"

export class ProductModel {
  static async create(
    data: any
  ) {
    const { error, data: parsedData } = validateProduct(data)
    if (error) throw new Error(error.message)

    const { name, price, categoryId, brandId, stock, lowStock, image } = parsedData

    const existingCategory = await prisma.categories.findUnique({ where: { id: categoryId, deleted: false } })
    if (!existingCategory) throw new Error('Category not found')

    const existingBrand = await prisma.brands.findUnique({ where: { id: brandId, deleted: false } })
    if (!existingBrand) throw new Error('Brand not found')

    const product = await prisma.products.findFirst({ where: { AND: [{ name }, { category_id: categoryId }, { deleted: false }] } })
    if (product) throw new Error('Product already exists')

    const { id } = await prisma.products.create({
      data: {
        name,
        price,
        category_id: categoryId,
        status: 'ACTIVE',
        brand_id: brandId,
        image,
        stock,
        low_stock: lowStock,
      }
    })

    return id
  }

  static async update(
    id: string,
    data: any
  ) {
    const { error, data: parsedData } = validatePartialProduct(data)
    if (error) throw new Error(error.message)

    const { name, price, categoryId, brandId, image, stock, lowStock, status } = parsedData

    const product = await prisma.products.findUnique({ where: { id } })
    if (!product) throw new Error('Product not found')

    if (name && name !== product.name) {
      const existingProduct = await prisma.products.findFirst({
        where: { AND: [{ name }, { category_id: categoryId }, { deleted: false }] }
      })
      if (existingProduct) throw new Error('Product with this name already exists in the same category')
    }

    if (status && status !== product.status) {
      if (!['ACTIVE', 'INACTIVE'].includes(status)) throw new Error('Invalid status')
    }

    if (categoryId && categoryId !== product.category_id) {
      const existingCategory = await prisma.categories.findUnique({ where: { id: categoryId, deleted: false } })
      if (!existingCategory) throw new Error('Category not found')
    }

    if (brandId && brandId !== product.brand_id) {
      const existingBrand = await prisma.brands.findUnique({ where: { id: brandId, deleted: false } })
      if (!existingBrand) throw new Error('Brand not found')
    }

    if (image && product.image && image !== product.image) {
      deleteImageFiles(product.image) // Eliminar la imagen anterior si existe
    }

    const updatedProduct = await prisma.products.update({
      where: { id },
      data: {
        name,
        price,
        category_id: categoryId,
        brand_id: brandId,
        image,
        stock,
        low_stock: lowStock,
        status: status || product.status // Mantener el estado anterior si no se proporciona uno nuevo
      }
    })

    return updatedProduct
  }

  static async getAll(page: number, take: number, name?: string, category?: string) {
    if (page < 1 || take < 1) throw new Error('Invalid page or take value')
    const where: any = {}

    if (name) {
      where.name = {
        contains: name,
      }
    }

    if (category && category !== 'all' && !isNaN(+category)) {
      where.category_id = +category
    }

    const products = await prisma.products.findMany({
      take,
      orderBy: {
        name: 'asc'
      },
      skip: (page - 1) * take,
      where: {
        deleted: false,
        ...where
      },
      include: {
        category: true,
        brand: true
      }
    })

    return {
      products,
      totalPages: Math.ceil(await prisma.products.count() / take),
      page
    }
  }

  static async getById(id: string) {
    const product = await prisma.products.findUnique({ where: { id }, include: { category: true } })
    if (!product) throw new Error('Product not found')

    return product
  }

  static async getByCategoryId(categoryId: number, status?: string) {
    const where: any = { category_id: categoryId }
    if (status) {
      where.status = status
    }
    const products = await prisma.products.findMany({
      where: {
        deleted: false,
        ...where,
      }
    })

    return products
  }

  static async delete(id: string) {
    const product = await prisma.products.findUnique({ where: { id } })

    if (!product) throw new Error('Product not found')

    await prisma.products.update({ where: { id }, data: { deleted: true } })
  }

  static async topSellingProducts(take: number) {
    if (take < 1) throw new Error('Invalid take value')
    // las ventas se obtienen a través de las órdenes
    const orders = await prisma.orders.findMany({
      where: {
        status: 'PAID',
        deleted: false
      },
      include: {
        order_items: {
          include: {
            product: true
          }
        }
      }
    })
    const productSales: { [key: string]: number } = {}
    orders.forEach(order => {
      order.order_items.forEach(item => {
        if (productSales[item.product.id]) {
          productSales[item.product.id] += item.quantity
        } else {
          productSales[item.product.id] = item.quantity
        }
      })
    })
    const sortedProducts = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, take)
      .map(([productId, quantity]) => ({ productId, quantity }))
    const productIds = sortedProducts.map(item => item.productId)
    const products = await prisma.products.findMany({
      where: {
        id: { in: productIds }
      },
      include: {
        category: true,
        brand: true
      }
    })
    return products.map(product => {
      const sale = sortedProducts.find(item => item.productId === product.id)
      return {
        ...product,
        quantity: sale ? sale.quantity : 0
      }
    })
  }

  static async countTotalProducts() {
    const total = await prisma.products.count({
      where: {
        deleted: false,
        status: 'ACTIVE'
      }
    })
    return total
  }

  static async countTotalProductsLowStock() {
    const products = await prisma.products.findMany({
      where: {
        stock: {
          lte: 0
        },
        low_stock: {
          gt: 0
        },
        status: 'ACTIVE',
        deleted: false
      }
    })
    const total = products.filter(product => {
      return product.stock <= product.low_stock && product.status === 'ACTIVE' && product.stock > 0
    }).length
    return total
  }

  static async countTotalProductsOutOfStock() {
    const products = await prisma.products.findMany({
      where: {
        stock: 0,
        status: 'ACTIVE',
        deleted: false
      }
    })
    return products.length
  }
}