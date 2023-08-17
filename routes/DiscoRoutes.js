import express from 'express';
import { getDiscos,createDisco } from '../controllers/DiscosController.js';

export const router = express.Router();

router
.get('/', getDiscos)
.post('/:id', createDisco)