import { Request, Response } from "express";
import { ClientModel } from "../models/client.js";
import { TAKE } from "../constants.js";

export const createClient = async (req: Request, res: Response) => {
  try {
    const { name, phone } = req.body;
    const clientId = await ClientModel.create({ name, phone });
    res.status(201).json({ id: clientId });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export const getClients = async (req: Request, res: Response) => {
  try {
    const { page = 1, take = TAKE, name } = req.query;

    const clients = await ClientModel.getAll(Number(page), Number(take), name?.toString());
    res.status(200).json(clients);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export const getClientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = await ClientModel.getById(Number(id));
    res.status(200).json(client);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await ClientModel.delete(Number(id));
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export const updateClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, phone } = req.body;
    await ClientModel.update(Number(id), { name, phone });
    res.status(200).json({ message: "Client updated successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}