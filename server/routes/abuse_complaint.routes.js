import { Router } from "express";
import { postAbuseComplaint } from "../controllers/abuse_complaint.controller.js";
import { validateToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/abuse_complaint', validateToken, postAbuseComplaint)

export default router;