import { Router } from "express";
import * as userController from "../controllers/user.controller.js"
import { body } from "express-validator";
import * as authMiddleware  from "../middlewares/auth.middleware.js"
const router = Router()
// creating api routes with validation using express-validator
router.post('/register',
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').isLength({min:3}).withMessage("Password must be atleast 3 characters") ,
    userController.createUserController);
router.post('/login',
body('email').isEmail().withMessage('Email must be a valid email address'),
body('password').isLength({min:3}).withMessage("Password must be atleast 3 characters") ,
userController.userLoginController);
router.get('/profile', authMiddleware.authUser,userController.getProfileController);
router.get('/logout',authMiddleware.authUser,userController.logoutUserController);
router.get('/all',authMiddleware.authUser,userController.getAllUsers)
export default router;