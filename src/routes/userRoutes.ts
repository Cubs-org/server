import { Router } from "express";
import UserController from "../controllers/UserController";

const router = Router();
const userController = new UserController();

router.post('/registerUser', userController.create);
router.post('/authenticateUser', userController.authenticateUser);
router.post('/authenticateUser/oauth', userController.authByGoogle);
router.get('/getUser', userController.get);
router.delete('/deleteUser', userController.setUserTrashedStatus);
router.delete('/deleteUser/permanently', userController.delete);

export default router;
