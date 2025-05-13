import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.get("/api", async (req,res)=>{
    const [result] = await pool.query('SELECT * FROM Tipo_usuario')
    console.log(result);
    res.json(result);
    //res.json({"users":["userOne", "userTwo", "useThree"]})
});


export default router;
