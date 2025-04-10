import { Router } from "express";

import {
    PostVaccinationSolicitude,
    getVaccinationSolicitude
} from '../controllers/vaccination_solicitude.controller.js'

import { validateToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/api/vaccination/:id_usuario', validateToken, getVaccinationSolicitude)
router.post('/vaccination', validateToken, PostVaccinationSolicitude)

export default router;