import { createPool } from 'mysql2/promise';
import { config } from 'dotenv';
import multer from 'multer'

config();

export const upload = multer({ storage: multer.memoryStorage() })

export const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});
