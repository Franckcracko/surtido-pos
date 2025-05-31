import { prisma } from "../lib/prisma.js"
import z from "zod"

export class CategoryModel {
  static async create({ name, description }: { name: string, description?: string }) {
    const categorySchema = z.object({
      name: z.string().min(1, "Name is required"),
      description: z.string().optional(),
    })

    const { error } = categorySchema.safeParse({ name, description })
    if (error) throw new Error(error.message)

    const category = await prisma.categories.findFirst({ where: { name, deleted: false } })
    if (category) throw new Error('Category already exists')

    const { id } = await prisma.categories.create({
      data: {
        name,
        active: 1,
        description,
      }
    })

    return id
  }

  static async getAll(name?: string) {
    const where: { [key: string]: any } = {}

    if (name) where.name = { contains: name, mode: 'insensitive' }

    const categories = await prisma.categories.findMany({
      orderBy: {
        name: 'asc'
      },
      where: {
        deleted: false,
        ...where
      },
      include: {
        products: true
      }
    })

    return categories
  }

  static async getAllActive() {
    const categories = await prisma.categories.findMany({
      where: {
        active: 1,
        deleted: false
      },
      orderBy: {
        name: 'asc'
      }
    })

    return categories
  }

  static async getById(id: number) {
    const category = await prisma.categories.findUnique({ where: { id } })
    if (!category) throw new Error('Category not found')

    return category
  }

  static async delete(id: number) {
    const category = await prisma.categories.findUnique({ where: { id }, include: { products: true } })

    if (!category) throw new Error('Category not found')

    await prisma.categories.update({ where: { id }, data: { deleted: true } })
  }

  static async updateStatus(id: number, { status }: { status: number }) {
    const category = await prisma.categories.findUnique({ where: { id } })
    if (!category) throw new Error('Category not found')

    const updatedCategory = await prisma.categories.update({
      where: { id },
      data: {
        active: status
      }
    })

    return updatedCategory
  }
}