import { prisma } from "../lib/prisma.js";
import z from "zod";
export class ClientModel {
    static async create({ name, phone }) {
        const clientSchema = z.object({
            name: z.string().min(1, "Name is required"),
            phone: z.string().min(1, "Phone is required")
        });
        const { error } = clientSchema.safeParse({ name, phone });
        if (error)
            throw new Error(error.message);
        const client = await prisma.clients.findFirst({ where: { name } });
        if (client)
            throw new Error('Client already exists');
        const { id } = await prisma.clients.create({
            data: {
                name,
                phone
            }
        });
        return id;
    }
    static async getAll(page, take, name) {
        // if (page < 1 || take < 1) throw new Error('Invalid page or take value')
        const clients = await prisma.clients.findMany({
            // take,
            orderBy: {
                name: 'asc'
            },
            include: {
                orders: true
            },
            // skip: (page - 1) * take,
            where: name ? {
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
            } : undefined,
        });
        return {
            clients,
            page,
            totalPages: Math.ceil(await prisma.brands.count() / take),
        };
    }
    static async getAllWithoutPagination() {
        const clients = await prisma.clients.findMany({
            orderBy: {
                name: 'asc'
            },
            include: {
                orders: true
            }
        });
        return clients;
    }
    static async getById(id) {
        const client = await prisma.clients.findUnique({ where: { id } });
        if (!client)
            throw new Error('Client not found');
        return client;
    }
    static async delete(id) {
        const client = await prisma.clients.findUnique({ where: { id } });
        if (!client)
            throw new Error('Client not found');
        await prisma.clients.delete({ where: { id } });
        return client;
    }
    static async countTotalClients() {
        const totalClients = await prisma.clients.count();
        return totalClients;
    }
    static async update(id, data) {
        const clientSchema = z.object({
            name: z.string().min(1, "Name is required"),
            phone: z.string().min(1, "Phone is required")
        });
        const { error, data: newClient } = clientSchema.safeParse(data);
        if (error)
            throw new Error(error.message);
        const client = await prisma.clients.findUnique({ where: { id } });
        if (!client)
            throw new Error('Client not found');
        const existingClient = await prisma.clients.findFirst({ where: { name: newClient.name, id: { not: id } } });
        if (existingClient)
            throw new Error('Client with this name already exists');
        await prisma.clients.update({
            where: { id },
            data: { name: newClient.name, phone: newClient.phone }
        });
        return { message: "Client updated successfully" };
    }
}
