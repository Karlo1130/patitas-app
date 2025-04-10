import { Router } from "express";
import { postLossComplaint } from "../controllers/loss_complaint.controller.js";
import { validateToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/loss_complaint', validateToken, postLossComplaint)

export default router;