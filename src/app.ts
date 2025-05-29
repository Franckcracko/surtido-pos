import express from 'express';
import indexRouter from './routes/index.js';
import { authMiddleware } from './middlewares/auth.js';
import viewsRouter from './routes/views.js';
import path from 'path';
import cookieParser from 'cookie-parser'

const app = express();

app.use(cookieParser()) // Middleware para parsear cookies

app.use(express.static(path.join(process.cwd(), "src", "public"))); // Configura la carpeta de archivos estáticos

app.use(express.static(path.join(process.cwd(), "src", "uploads"))); // Configura la carpeta de archivos estáticos

app.set('view engine', 'ejs') // Configura el motor de plantillas EJS

app.set("views", path.join(process.cwd(), "src", "views")); // Configura la carpeta de vistas

app.disable('x-powered-by') // Desactiva el encabezado x-powered-by

app.use('/api', authMiddleware, indexRouter)
app.use('/', authMiddleware, viewsRouter)

export default app;