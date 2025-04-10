import { Router } from 'express'
import {
 getAdoption,
 getAllAdoptions,
 PostNewAnimal,
 postAdoption,
 getSpecies
} from '../controllers/adoption.controller.js';
import { validateToken } from '../middlewares/authMiddleware.js';
import { createRequire } from "module";

const router = Router();


const require = createRequire(import.meta.url);
const multer = require('multer')

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/api/adoption', validateToken, getAllAdoptions);
router.get('/api/species', validateToken, getSpecies);
router.post('/adoption', validateToken, postAdoption);
router.post('/adoption/newAnimal', upload.single('imagen'), validateToken, PostNewAnimal);

export default router;
