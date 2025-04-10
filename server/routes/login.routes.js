import { Router } from 'express';
import { 
    getLogin,
    postForm
} from "../controllers/login.controller.js";


const router = Router();


router.post('/login', postForm);    

export default router;