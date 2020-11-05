import express from 'express';
import { postOrder, getOrders } from '../controllers/order.js'

const router = express.Router();

router.get('/', getOrders);
router.post('/', postOrder);

export default router;