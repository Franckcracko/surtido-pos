import { Router } from "express";
import { getClients, createClient, getClientById, deleteClient, updateClient } from "../controllers/clients.js"

const clientRouter = Router()

clientRouter.get('/', getClients)
clientRouter.get('/:id', getClientById)
clientRouter.post('/', createClient)
clientRouter.delete('/:id', deleteClient)
clientRouter.put('/:id', updateClient)

export default clientRouter