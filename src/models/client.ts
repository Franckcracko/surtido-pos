import { prisma } from "../lib/prisma.js"
import z from "zod"

export class ClientModel {
  static async create({ name, phone }: { name: string; phone: string }) {
    const clientSchema = z.object({
      name: z.string().min(1, "Name is required"),
      phone: z.string().min(1, "Phone is required")
    })

    const { error } = clientSchema.safeParse({ name, phone })
    if (error) throw new Error(error.message)

    const client = await prisma.clients.findFirst({ where: { name, deleted: false } })
    if (client) throw new Error('Client already exists')

    const { id } = await prisma.clients.create({
      data: {
        name,
        phone
      }
    })

    return id
  }

  static async getAll(page: number, take: number, name?: string) {
    // if (page < 1 || take < 1) throw new Error('Invalid page or take value')
    const where: any = name ? {
      OR: [
        {
          name: {
            contains: name,
          }
        },
        {
          phone: {
            contains: name,
          }
        }
      ]
    } : {}
    const clients = await prisma.clients.findMany({
      // take,
      orderBy: {
        name: 'asc'
      },
      include: {
        orders: true
      },
      // skip: (page - 1) * take,
      where: {
        deleted: false,
        ...where
      },
    })

    return {
      clients,
      page,
      totalPages: Math.ceil(await prisma.brands.count() / take),
    }
  }

  static async getAllWithoutPagination() {
    const clients = await prisma.clients.findMany({
      orderBy: {
        name: 'asc'
      },
      include: {
        orders: true
      },
      where: {
        deleted: false
      }
    })

    return clients
  }

  static async getById(id: number) {
    const client = await prisma.clients.findUnique({ where: { id } })
    if (!client) throw new Error('Client not found')

    return client
  }

  static async delete(id: number) {
    const client = await prisma.clients.findUnique({ where: { id } })
    if (!client) throw new Error('Client not found')

    await prisma.clients.update({ where: { id }, data: { deleted: true } })

    return client
  }

  static async countTotalClients() {
    const totalClients = await prisma.clients.count({ where: { deleted: false } })
    return totalClients
  }

  static async update(id: number, data: any) {
    const clientSchema = z.object({
      name: z.string().min(1, "Name is required"),
      phone: z.string().min(1, "Phone is required")
    })

    const { error, data: newClient } = clientSchema.safeParse(data)
    if (error) throw new Error(error.message)

    const client = await prisma.clients.findUnique({ where: { id } })
    if (!client) throw new Error('Client not found')

    const newClientData: any = {}

    if (newClient.name !== client.name) {
      const existingClient = await prisma.clients.findFirst({ where: { name: newClient.name, deleted: false, id: { not: id } } })
      if (existingClient) throw new Error('Client with this name already exists')
      newClientData.name = newClient.name
    }

    if (newClient.phone !== client.phone) {
      const existingClient = await prisma.clients.findFirst({ where: { phone: newClient.phone, deleted: false, id: { not: id } } })
      if (existingClient) throw new Error('Client with this phone already exists')
      newClientData.phone = newClient.phone
    }

    await prisma.clients.update({
      where: { id },
      data: newClientData
    })

    return { message: "Client updated successfully" }
  }
}