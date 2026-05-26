import { Request, Response } from "express";
import bwipjs from "bwip-js";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProductServices } from "./products.service";
import AppError from "../../errors/AppError";

/**
 * Creates a new syringe product log record
 */
const addProducts = catchAsync(async (req: Request, res: Response) => {
  const {
    materialDescription,
    quantity,
    contentCode,
    batchLot,
    prodDate,
    expiryDate,
    custPartNo,
    orderNumber
  } = req.body;

  // Comprehensive validation checks
  if (
    materialDescription === undefined || materialDescription === null || String(materialDescription).trim() === "" ||
    quantity === undefined || quantity === null ||
    contentCode === undefined || contentCode === null || String(contentCode).trim() === "" ||
    batchLot === undefined || batchLot === null || String(batchLot).trim() === "" ||
    prodDate === undefined || prodDate === null || String(prodDate).trim() === "" ||
    expiryDate === undefined || expiryDate === null || String(expiryDate).trim() === "" ||
    custPartNo === undefined || custPartNo === null || String(custPartNo).trim() === "" ||
    orderNumber === undefined || orderNumber === null || String(orderNumber).trim() === ""
  ) {
    throw new AppError(400, "All fields (materialDescription, quantity, contentCode, batchLot, prodDate, expiryDate, custPartNo, orderNumber) are required and cannot be empty.");
  }

  const qty = Number(quantity);
  if (isNaN(qty) || qty <= 0 || !Number.isInteger(qty)) {
    throw new AppError(400, "Quantity must be a valid positive integer.");
  }

  const parsedProdDate = new Date(prodDate);
  const parsedExpiryDate = new Date(expiryDate);
  if (isNaN(parsedProdDate.getTime()) || isNaN(parsedExpiryDate.getTime())) {
    throw new AppError(400, "Production date and Expiry date must be valid date values.");
  }

  const result = await ProductServices.createProductInDB({
    materialDescription: String(materialDescription).trim(),
    quantity: qty,
    contentCode: String(contentCode).trim(),
    batchLot: String(batchLot).trim(),
    prodDate: parsedProdDate,
    expiryDate: parsedExpiryDate,
    custPartNo: String(custPartNo).trim(),
    orderNumber: String(orderNumber).trim(),
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Product created successfully",
    data: result,
  });
});

/**
 * Retrieves all product logs
 */
const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductServices.getAllProductsFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Products fetched successfully",
    data: result,
  });
});

/**
 * Retrieves a single product log by database ID
 */
const getProductById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await ProductServices.getProductByIdFromDB(id);

  if (!result) {
    throw new AppError(404, "Product not found");
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Product fetched successfully",
    data: result,
  });
});

/**
 * Generates and returns a QR barcode image pointing to the product landing view
 */
const generateQR = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!id) {
    throw new AppError(400, "Product ID is required");
  }

  // Verify the product exists in the DB first before compiling QR
  const productExists = await ProductServices.getProductByIdFromDB(id);
  if (!productExists) {
    throw new AppError(404, "Product not found");
  }

  const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const productUrl = `${baseUrl}/product/${id}`;

  // Call barcode generator callback
  bwipjs.toBuffer(
    {
      bcid: "qrcode", 
      text: productUrl, 
      scale: 4, 
    },
    function (err, png) {
      if (err) {
        console.error("bwipjs error:", err);
        res.status(500).json({
          success: false,
          message: "Failed to generate QR code",
        });
      } else {
        res.setHeader("Content-Type", "image/png");
        res.status(200).send(png);
      }
    }
  );
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const productExists = await ProductServices.getProductByIdFromDB(id);
  if (!productExists) {
    throw new AppError(404, "Product not found");
  }

  // Validate incoming update fields
  const updates: any = {};
  
  if (req.body.materialDescription !== undefined) {
    if (req.body.materialDescription === null || String(req.body.materialDescription).trim() === "") {
      throw new AppError(400, "Material description cannot be empty.");
    }
    updates.materialDescription = String(req.body.materialDescription).trim();
  }

  if (req.body.quantity !== undefined) {
    const qty = Number(req.body.quantity);
    if (isNaN(qty) || qty <= 0 || !Number.isInteger(qty)) {
      throw new AppError(400, "Quantity must be a valid positive integer.");
    }
    updates.quantity = qty;
  }

  if (req.body.contentCode !== undefined) {
    if (req.body.contentCode === null || String(req.body.contentCode).trim() === "") {
      throw new AppError(400, "Content Code (GTIN) cannot be empty.");
    }
    updates.contentCode = String(req.body.contentCode).trim();
  }

  if (req.body.batchLot !== undefined) {
    if (req.body.batchLot === null || String(req.body.batchLot).trim() === "") {
      throw new AppError(400, "Batch / Lot cannot be empty.");
    }
    updates.batchLot = String(req.body.batchLot).trim();
  }

  if (req.body.prodDate !== undefined) {
    if (req.body.prodDate === null || String(req.body.prodDate).trim() === "") {
      throw new AppError(400, "Production date cannot be empty.");
    }
    const parsedDate = new Date(req.body.prodDate);
    if (isNaN(parsedDate.getTime())) {
      throw new AppError(400, "Production date must be a valid date value.");
    }
    updates.prodDate = parsedDate;
  }

  if (req.body.expiryDate !== undefined) {
    if (req.body.expiryDate === null || String(req.body.expiryDate).trim() === "") {
      throw new AppError(400, "Expiry date cannot be empty.");
    }
    const parsedDate = new Date(req.body.expiryDate);
    if (isNaN(parsedDate.getTime())) {
      throw new AppError(400, "Expiry date must be a valid date value.");
    }
    updates.expiryDate = parsedDate;
  }

  if (req.body.custPartNo !== undefined) {
    if (req.body.custPartNo === null || String(req.body.custPartNo).trim() === "") {
      throw new AppError(400, "Customer Part Number cannot be empty.");
    }
    updates.custPartNo = String(req.body.custPartNo).trim();
  }

  if (req.body.orderNumber !== undefined) {
    if (req.body.orderNumber === null || String(req.body.orderNumber).trim() === "") {
      throw new AppError(400, "Order Number cannot be empty.");
    }
    updates.orderNumber = String(req.body.orderNumber).trim();
  }

  const result = await ProductServices.updateProductInDB(id, updates);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Product updated successfully",
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const productExists = await ProductServices.getProductByIdFromDB(id);
  if (!productExists) {
    throw new AppError(404, "Product not found");
  }

  const result = await ProductServices.deleteProductFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Product deleted successfully",
    data: result,
  });
});

export const products = {
  addProducts,
  getAllProducts,
  getProductById,
  generateQR,
  updateProduct,
  deleteProduct,
};
