import { ClientModel } from "../models/client.js";
import { TAKE } from "../constants.js";
export const createClient = async (req, res) => {
    try {
        const { name, phone } = req.body;
        const clientId = await ClientModel.create({ name, phone });
        res.status(201).json({ id: clientId });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const getClients = async (req, res) => {
    try {
        const { page = 1, take = TAKE, name } = req.query;
        const clients = await ClientModel.getAll(Number(page), Number(take), name?.toString());
        res.status(200).json(clients);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const getClientById = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await ClientModel.getById(Number(id));
        res.status(200).json(client);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        await ClientModel.delete(Number(id));
        res.status(204).send();
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone } = req.body;
        await ClientModel.update(Number(id), { name, phone });
        res.status(200).json({ message: "Client updated successfully" });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
