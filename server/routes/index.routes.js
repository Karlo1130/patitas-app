import { Router } from 'express'
import { validateToken } from '../middlewares/authMiddleware.js';

import {
 getIndex,
 getCards
} from '../controllers/index.controller.js';

const router = Router();

router.get('/api/index', validateToken, getCards)

export default router;
