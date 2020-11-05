import express from 'express';
import { autho } from '../controllers/jwtfun.js';
import { showBoard } from '../controllers/dashboard.js'

const router = express.Router();

router.get('/', showBoard);

export default router;