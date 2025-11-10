import { Router } from "express";
import { Register, Login, refresh, logout } from "../controllers/authenticationController";
import { auth } from "../middleware/authMiddleware";

const router = Router();

router.post('/register', Register);
router.post('/login', Login);
router.post('/refresh', refresh);
router.get('/logout',auth, logout);



export default router