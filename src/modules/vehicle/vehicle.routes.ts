import auth from "../../middleware/auth";
import { vehicleControllers } from "./vehicle.controller";

const { Router } = require("express");

const router = Router();

router.post("/", auth("admin"), vehicleControllers.createVehicle)

export const vehicleRoutes = router