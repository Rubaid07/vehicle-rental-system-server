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

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "failed to create booking",
      });
    }

    res.status(201).json({
      success: true,
      message: "Booking record fetched successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const result = await bookingServices.getBookings(user?.id, user?.role);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "booking record not found",
      });
    }

    res.status(201).json({
      success: true,
      message: "Booking create successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update booking controller
const updateBooking = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const result = await bookingServices.updateBooking(req.params.bookingId as string, req.body, user.id, user.role);
    
     res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: result
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      errors: err.message,
    });
  }
};

export const bookingControllers = {
  createBooking,
  getBookings,
  updateBooking
};
