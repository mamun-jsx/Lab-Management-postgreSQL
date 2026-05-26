import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";

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
  const result = await prisma.user.delete({
    where: { id },
    select: safeUserSelection,
  });
  return result;
};

export const UserServices = {
  createUserInDB,
  getAllUsersFromDB,
  getUserByIdFromDB,
  updateUserInDB,
  deleteUserFromDB,
};
