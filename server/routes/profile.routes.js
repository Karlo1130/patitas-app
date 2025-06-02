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
    deleteVeterinarian,
    putPetInAdoption
} from "../controllers/profile.controller.js";
import { upload } from '../db.js';

const router = Router();

router.get('/api/profile/:id_usuario', validateToken, getProfileData)

router.post('/profile/:id_usuario', upload.single('file'), validateToken, PostNewPet)

router.put('/profile/putPetInAdoption/:id_usuario', validateToken, putPetInAdoption)
router.put('/profile/:id_usuario', upload.single('file'), validateToken, putProfile)

router.delete('/profile/deletePet', validateToken, deletePet)


//rutas de veterinaria
router.get('/api/profile/:id_veterinarian', validateToken, authorizeRoles(1), getVetProfileData)

router.post('/vet/profile/:id_usuario', validateToken, authorizeRoles(1), PostNewVeterinarian)

router.put('/vet/profile/:id_usuario', validateToken, authorizeRoles(1), putVetProfile)

router.delete('/vet/profile/deleteVet', validateToken, authorizeRoles(1), deleteVeterinarian)


export default router;
