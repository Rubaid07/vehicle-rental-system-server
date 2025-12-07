import { Request, Response } from "express";
import { userServices } from "./user.service";

const getUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUser()
    res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: result
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
   try {
    const result = await userServices.getSingleUser(req.params.userId as string);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: result,
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

const updateUser =  async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const result = await userServices.updateUser(name, email, req.params.userId!)

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: result,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.deleteUser(req.params.userId!)

    if (!result) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: null,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export const userControllers = {
  getUser,
  getSingleUser,
  updateUser,
  deleteUser
}