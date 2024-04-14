import { Router } from "express";
import UserController from "../controllers/UserController";

const router = Router();
const userController = new UserController();

router.post('/registerUser', userController.create.bind(userController));
router.post('/authenticateUser', userController.authenticateUser.bind(userController));
router.post('/authenticateUser/oauth', userController.authByGoogle.bind(userController));
router.get('/getUser', userController.get.bind(userController));
router.delete('/deleteUser', userController.setUserTrashedStatus.bind(userController));
router.delete('/deleteUser/permanently', userController.delete.bind(userController));

export default router;
