import { Router } from "express";
import { getLoggedInUser, getUser } from "../controllers/userController";
import { auth, authorize } from "../middleware/authMiddleware";
import { UserRoles } from "../utilities/enums/UserRole";

const router = Router();

router.get('/active', auth,authorize(UserRoles.User, UserRoles.Admin), getLoggedInUser);
router.get('/:id', auth, authorize(UserRoles.User, UserRoles.Admin), getUser);




export default router