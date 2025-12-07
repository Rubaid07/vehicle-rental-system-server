import auth from "../../middleware/auth";
import { vehicleControllers } from "./vehicle.controller";

const { Router } = require("express");

const router = Router();

router.post("/", auth("admin"), vehicleControllers.createVehicle)

router.get("/", vehicleControllers.getVehicles)
router.get("/:vehicleId", vehicleControllers.getSingleVehicle)

export const vehicleRoutes = router