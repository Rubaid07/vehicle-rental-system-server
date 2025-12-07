import express, { Request, Response } from "express";
import initDB from "./config/db";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/user/user.routes";
import { vehicleRoutes } from "./modules/vehicle/vehicle.routes";

const app = express();
app.use(express.json());
initDB();
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

//  ------------------Auth Routes----------------
app.use("/api/v1/auth", authRoutes);

//  ------------------User Routes-----------------
app.use("/api/v1/users", userRoutes)

//  ------------------Vehicle Routes----------------
app.use("/api/v1/vehicles", vehicleRoutes)


// ------------------not found route------------------
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app;
