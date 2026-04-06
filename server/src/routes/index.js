// employeeRoutes.js
import express from 'express';
export const employeeRoutes = express.Router();
import { getEmployees, createEmployee } from '../controllers/employeeController.js';
employeeRoutes.route('/').get(getEmployees).post(createEmployee);

// trainerRoutes.js
export const trainerRoutes = express.Router();
import { getTrainers, createTrainer } from '../controllers/trainerController.js';
trainerRoutes.route('/').get(getTrainers).post(createTrainer);

// batchRoutes.js
export const batchRoutes = express.Router();
import { getBatches, createBatch } from '../controllers/batchController.js';
batchRoutes.route('/').get(getBatches).post(createBatch);
