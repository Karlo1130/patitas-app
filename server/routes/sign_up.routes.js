import { Router } from 'express';
import { 
    getSign_up,
    postForm
} from "../controllers/sign_up.controller.js";

const router = Router();

router.post('/sign_up', postForm);

export default router;