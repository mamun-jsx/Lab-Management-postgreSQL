import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import AppError from "../../errors/AppError";

// Define TypeScript interfaces for our User Service layer
interface IUserPayload {
  name: string;
  employeeId: string;
  email: string;
  mobileNumber: string;
  password:  string;
  role?: string;
}

// Select only safe fields to omit returning passwords
const safeUserSelection = {
  id: true,
  employeeId: true,
  email: true,
  name: true,
  mobileNumber: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

/**
 * Creates a new user with hashed password
 */
const createUserInDB = async (payload: IUserPayload) => {
  // Hash password before saving to DB
  const rounds = 10;
  const hashedPassword = await bcrypt.hash(payload.password, rounds);

  const result = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
    select: safeUserSelection,
  });
  return result;
};

/**
 * Retrieves all registered users
 */
const getAllUsersFromDB = async () => {
  const result = await prisma.user.findMany({
    select: safeUserSelection,
  });
  return result;
};

/**
 * Retrieves a single user details by database ID
 */
const getUserByIdFromDB = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: { id },
    select: safeUserSelection,
  });
  return result;
};

/**
 * Updates an existing user's details and hashes password if modified
 */
const updateUserInDB = async (id: string, payload: Partial<IUserPayload>) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new AppError(404, "User account not found");
  }

  if (user.employeeId === "EMP-1" || user.employeeId === "EMP-2") {
    throw new AppError(400, "Demo system administrator and user accounts cannot be updated.");
  }

  const updateData: any = { ...payload };

  // If password is provided in the payload, hash it before database update
  if (payload.password) {
    const rounds = 10;
    updateData.password = await bcrypt.hash(payload.password, rounds);
  }

  const result = await prisma.user.update({
    where: { id },
    data: updateData,
    select: safeUserSelection,
  });
  return result;
};

/**
 * Removes a user account from database
 */
const deleteUserFromDB = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new AppError(404, "User account not found");
  }

  if (user.employeeId === "EMP-1" || user.employeeId === "EMP-2") {
    throw new AppError(400, "Demo system administrator and user accounts cannot be deleted.");
  }

  const result = await prisma.user.delete({
    where: { id },
    select: safeUserSelection,
  });
  return result;
};

/**
 * Retrieves a user by employeeId and email (including the password for validation)
 */
const getUserByCredentials = async (employeeId: string, email: string) => {
  const result = await prisma.user.findFirst({
    where: {
      employeeId,
      email,
    },
  });
  return result;
};

export const UserServices = {
  createUserInDB,
  getAllUsersFromDB,
  getUserByIdFromDB,
  updateUserInDB,
  deleteUserFromDB,
  getUserByCredentials,
};
