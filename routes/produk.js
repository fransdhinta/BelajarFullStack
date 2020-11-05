import express from 'express';

import { getItems, getItem, createItem, deleteItem, updateItem } from '../controllers/produk.js'

const router = express.Router();

router.get('/', getItems);
router.get('/:id', getItem);
router.post('/create', createItem);
router.delete('/:id', deleteItem);
router.patch('/:id', updateItem);

export default router;