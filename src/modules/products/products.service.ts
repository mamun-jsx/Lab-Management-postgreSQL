import { prisma } from "../../lib/prisma";

// TypeScript interface defining properties of a syringe order
interface ISyringeOrderPayload {
  materialDescription: string;
  quantity: number;
  contentCode: string;
  batchLot: string;
  prodDate: string | Date;
  expiryDate: string | Date;
  custPartNo: string;
  orderNumber: string;
}

/**
 * Creates a new Syringe Order log in the database
 */
const createProductInDB = async (payload: ISyringeOrderPayload) => {
  const result = await prisma.syringeOrder.create({
    data: {
      ...payload,
      prodDate: new Date(payload.prodDate),
      expiryDate: new Date(payload.expiryDate),
    },
  });
  return result;
};

/**
 * Fetches all Syringe Orders from the database
 */
const getAllProductsFromDB = async () => {
  const result = await prisma.syringeOrder.findMany();
  return result;
};

/**
 * Retrieves a single Syringe Order by its unique database ID
 */
const getProductByIdFromDB = async (id: string) => {
  const result = await prisma.syringeOrder.findUnique({
    where: { id },
  });
  return result;
};

const updateProductInDB = async (id: string, payload: Partial<ISyringeOrderPayload>) => {
  const dataToUpdate: any = { ...payload };
  if (payload.prodDate) {
    dataToUpdate.prodDate = new Date(payload.prodDate);
  }
  if (payload.expiryDate) {
    dataToUpdate.expiryDate = new Date(payload.expiryDate);
  }

  const result = await prisma.syringeOrder.update({
    where: { id },
    data: dataToUpdate,
  });
  return result;
};

const deleteProductFromDB = async (id: string) => {
  const result = await prisma.syringeOrder.delete({
    where: { id },
  });
  return result;
};

export const ProductServices = {
  createProductInDB,
  getAllProductsFromDB,
  getProductByIdFromDB,
  updateProductInDB,
  deleteProductFromDB,
};
