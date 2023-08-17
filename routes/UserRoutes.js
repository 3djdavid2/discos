import express from 'express';
import {getUsers, createUser} from '../controllers/UserController.js';

export const router = express.Router();


router
.get('/', getUsers)
.post('/:id', createUser)