import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./users.service";
import AppError from "../../errors/AppError";

/**
 * Creates a new user record
 */
const createUser = catchAsync(async (req: Request, res: Response) => {
  const { name, employeeId, email, mobileNumber, password } = req.body;

  // Basic validation check
  if (!name || !employeeId || !email || !mobileNumber || !password) {
    throw new AppError(400, "All fields (name, employeeId, email, mobileNumber, password) are required");
  }

  const result = await UserServices.createUserInDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User account created successfully",
    data: result,
  });
});

/**
 * Retrieves all user accounts
 */
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllUsersFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users fetched successfully",
    data: result,
  });
});

/**
 * Retrieves a single user by database ID
 */
const getUserById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await UserServices.getUserByIdFromDB(id);

  if (!result) {
    throw new AppError(404, "User account not found");
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User fetched successfully",
    data: result,
  });
});

/**
 * Updates user credentials and account details
 */
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  // Check if user exists in database first
  const userExists = await UserServices.getUserByIdFromDB(id);
  if (!userExists) {
    throw new AppError(404, "User account not found");
  }

  const result = await UserServices.updateUserInDB(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User account updated successfully",
    data: result,
  });
});

/**
 * Deletes user profile
 */
const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  // Check if user exists in database first
  const userExists = await UserServices.getUserByIdFromDB(id);
  if (!userExists) {
    throw new AppError(404, "User account not found");
  }

  const result = await UserServices.deleteUserFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User account deleted successfully",
    data: result,
  });
});

export const UserControllers = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
