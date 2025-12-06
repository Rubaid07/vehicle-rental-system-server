import { Router } from "express";
import auth from "../../middleware/auth";
import { userControllers } from "./user.controller";

const router = Router();


router.get("/", auth("admin"), userControllers.getUser);


router.get("/:userId", auth("admin"), userControllers.getSingleUser);


router.put("/:userId", auth("admin", "customer"), userControllers.updateUser);


router.delete("/:userId", auth("admin"), userControllers.deleteUser);

export const userRoutes = router;