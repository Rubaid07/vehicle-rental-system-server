import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    // If customer is creating , use their ID
    const customer_id =
      user?.role === "customer" ? user.id : req.body.customer_id;

    if (!customer_id) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required",
      });
    }

    const bookingData = {
      ...req.body,
      customer_id,
    };

    const result = await bookingServices.createBooking(bookingData);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const result = await bookingServices.getBookings(user?.id, user?.role);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error"
    });
  }
};


export const bookingControllers = {
  createBooking,
  getBookings
};
