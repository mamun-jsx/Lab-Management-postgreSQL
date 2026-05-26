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
  const { materialDescription, quantity } = req.body;

  // Basic validation check
  if (!materialDescription || !quantity) {
    throw new AppError(400, "Required fields (materialDescription, quantity) are missing");
  }

  const result = await ProductServices.createProductInDB(req.body);

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

export const products = {
  addProducts,
  getAllProducts,
  getProductById,
  generateQR,
};
