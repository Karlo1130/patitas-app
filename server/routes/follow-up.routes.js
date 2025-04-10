import { Router } from "express";
import { validateToken } from "../middlewares/authMiddleware.js";

import { 
    getRequest,
    getVaccinationRequests,
    getVeterinarians,
    putVaccinationRequests
} from "../controllers/follow-up.controller.js";

const router = Router();

//cliente
router.get('/api/follow-up', validateToken, getRequest)

//veterinarias
router.get('/api/vet/follow-up/:id_usuario', validateToken, getVaccinationRequests)
router.get('/api/vet/veterinarian/:id_usuario', validateToken, getVeterinarians)
router.put('/vet/follow-up/update', validateToken, putVaccinationRequests)

export default router;
