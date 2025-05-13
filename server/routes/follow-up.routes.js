import { Router } from "express";
import { validateToken, authorizeRoles } from "../middlewares/authMiddleware.js";

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
router.get('/api/vet/follow-up/:id_usuario', validateToken, authorizeRoles(1), getVaccinationRequests)
router.get('/api/vet/veterinarian/:id_usuario', validateToken, authorizeRoles(1), getVeterinarians)
router.put('/vet/follow-up/update', validateToken, authorizeRoles(1), putVaccinationRequests)

export default router;
