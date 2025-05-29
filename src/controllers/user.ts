import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { UserModel } from "../models/user.js"
import { SECRET_JWT_KEY } from "../config.js"

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body

  try {
    const user = await UserModel.login({ username, password })
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      SECRET_JWT_KEY!,
      {
        expiresIn: '1h'
      }
    )

    res
      .cookie('access_token', token, {
        httpOnly: true, // para que no sea accesible desde JavaScript
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict', // para evitar ataques CSRF, solo se enviará en solicitudes de la misma web
        maxAge: 1000 * 60 * 60 // 1 hora
      })
      .json({ user })
  } catch (error: any) {
    console.log(error)
    res.status(401).json({ error: error.message })
  }
}

export const register = async (req: Request, res: Response) => {
  const { username, password, email } = req.body

  try {
    // Aquí puedes llamar a tu UserRepository para crear un nuevo usuario
    const id = await UserModel.create({ username, password, email })

    res.status(201).json({ id })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const logout = (_req: Request, res: Response) => {
  res
    .clearCookie('access_token')
    .redirect('/')
}

export const getProfile = async (req: Request, res: Response) => {
  const userId = req.session?.user?.id

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  try {
    const user = await UserModel.getById(userId)
    res.status(200).json(user)
  } catch (error:any) {
    res.status(400).json({ error: error.message })
  }
}

export const updatePassword = async (req: Request, res: Response) => {
  const userId = req.session?.user?.id
  const { newPassword } = req.body

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  try {
    const updatedUser = await UserModel.updatePassword({ id: userId, newPassword })
    res.status(200).json(updatedUser)
  } catch (error:any) {
    console.log(error)
    res.status(400).json({ error: error.message })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.session?.user?.id

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  try {
    await UserModel.delete(userId)
    res.status(204).send() // No content
  } catch (error:any) {
    console.log(error)
    res.status(400).json({ error: error.message })
  }
}