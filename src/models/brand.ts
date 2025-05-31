import { prisma } from "../lib/prisma.js"
import { validateBrand, validatePartialBrand } from "../schemas/brand.js"

export class BrandModel {
  static async create({ name }: { name: string }) {
    const { error } = validateBrand({ name })

    if (error) throw new Error(error.message)

    const brand = await prisma.brands.findFirst({ where: { name, deleted: true } })
    if (brand) throw new Error('Brand already exists')

    const { id } = await prisma.brands.create({
      data: {
        name: name,
        status: 1
      }
    })

    return id
  }

  static async getAll(name?: string) {
    const brands = await prisma.brands.findMany({
      orderBy: {
        name: 'asc'
      },
      where: {
        name: {
          contains: name,
        },
        deleted: false
      }
    })

    return {
      brands,
    }
  }

  static async getById(id: number) {
    const brand = await prisma.brands.findUnique({ where: { id } })
    if (!brand) throw new Error('Brand not found')

    return brand
  }

  static async update(id: number, data: any) {
    const { data: { name, status }, error } = validatePartialBrand(data)

    if (error) throw new Error(error.message)

    const brand = await prisma.brands.findUnique({ where: { id } })
    if (!brand) throw new Error('Brand not found')

    if (name) {
      const existingBrand = await prisma.brands.findFirst({ where: { name, deleted: false } })
      if (existingBrand && existingBrand.id !== id) throw new Error('Brand with this name already exists')
    }

    const updatedBrand = await prisma.brands.update({
      where: { id },
      data: {
        name,
        status
      }
    })

    return updatedBrand
  }

  static async delete(id: number) {
    const brand = await prisma.brands.findUnique({ where: { id } })
    if (!brand) throw new Error('Brand not found')

    await prisma.brands.update({ where: { id }, data: { deleted: true } })

    return brand
  }

}