import { Router } from 'express'
import {
 getAdoption,
 getAllAdoptions,
 PostNewAnimal,
 postAdoption,
 getSpecies
} from '../controllers/adoption.controller.js';
import { validateToken } from '../middlewares/authMiddleware.js';
import { upload } from '../db.js';

const router = Router();

router.get('/api/adoption', validateToken, getAllAdoptions);
router.get('/api/species', validateToken, getSpecies);
router.post('/adoption', validateToken, postAdoption);
router.post('/adoption/newAnimal', upload.single('file'), validateToken, PostNewAnimal);

export default router;
