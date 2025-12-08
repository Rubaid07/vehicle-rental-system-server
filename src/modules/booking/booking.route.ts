import { Router } from "express";
import auth from "../../middleware/auth";
import { bookingControllers } from "./booking.controller";

const router = Router();

router.post("/", auth("customer", "admin"), bookingControllers.createBooking);

router.get("/", auth("customer", "admin"), bookingControllers.getBookings)

export const bookingRoutes = router;