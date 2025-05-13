import { Router } from "express";
import { validateToken, authorizeRoles} from '../middlewares/authMiddleware.js';
import { 
    PostNewPet,
    PostNewVeterinarian,
    deletePet,
    getProfileData,
    getVetProfileData,
    putVetProfile,
    putProfile,
    deleteVeterinarian
} from "../controllers/profile.controller.js";

const router = Router();

router.get('/api/profile/:id_usuario', validateToken, getProfileData)

router.post('/profile/:id_usuario', validateToken, PostNewPet)

router.put('/profile/:id_usuario', validateToken, putProfile)

router.delete('/profile/deletePet', validateToken, deletePet)


//rutas de veterinaria
router.get('/api/profile/:id_veterinarian', validateToken, authorizeRoles(1), getVetProfileData)

router.post('/vet/profile/:id_usuario', validateToken, authorizeRoles(1), PostNewVeterinarian)

router.put('/vet/profile/:id_usuario', validateToken, authorizeRoles(1), putVetProfile)

router.delete('/vet/profile/deleteVet', validateToken, authorizeRoles(1), deleteVeterinarian)


export default router;
