import { Router } from "express";
import { body } from "express-validator";
import * as projectController from "../controllers/project.controller.js";
import * as authMiddleware from "../middlewares/auth.middleware.js"

const router = Router()

router.post('/create',authMiddleware.authUser, body('name').isString().withMessage('Name is required'), projectController.createProject)
router.get('/all',authMiddleware.authUser,projectController.getAllProject);
router.put('/add-users',authMiddleware.authUser,body('projectId').isString().withMessage('projectId should be an string'),body('users').isArray({min: 1}).withMessage('users name should be in array').bail().custom((users)=> users.every((user)=> typeof user === 'string')).withMessage("each user must be a string"),projectController.addUserInProj)
router.get('/get-project/:projectId', authMiddleware.authUser,projectController.getProjectDetails)
export default router

