import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
import { SALT_ROUNDS } from "../config.js";
import { validateUser, validatePartialUser } from "../schemas/user.js";
export class UserModel {
    static async create({ username, password, email }) {
        const { error } = validateUser({ username, password, email });
        if (error)
            throw new Error(error.message);
        const user = await prisma.users.findUnique({ where: { username } });
        if (user)
            throw new Error('Username already exists');
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const { id } = await prisma.users.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });
        return id;
    }
    static async login({ username, password }) {
        const user = await prisma.users.findUnique({ where: { username } });
        if (!user)
            throw new Error('User not found');
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            throw new Error('Invalid password');
        const { password: _, ...publicUser } = user;
        return publicUser;
    }
    static async getById(id) {
        const user = await prisma.users.findUnique({ where: { id } });
        if (!user)
            throw new Error('User not found');
        const { password: _, ...publicUser } = user;
        return publicUser;
    }
    static async updatePassword({ id, newPassword }) {
        const { error } = validatePartialUser({ password: newPassword });
        if (error)
            throw new Error(error.message);
        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
        const user = await prisma.users.update({
            where: { id },
            data: { password: hashedPassword }
        });
        return user;
    }
    static async delete(id) {
        const user = await prisma.users.findUnique({ where: { id } });
        if (!user)
            throw new Error('User not found');
        await prisma.users.delete({ where: { id } });
    }
}
