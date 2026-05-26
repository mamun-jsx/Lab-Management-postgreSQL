import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import bwipjs from "bwip-js";
// add products
export const addProducts = async (req: Request, res: Response) => {
  try {
    const {
      materialDescription,
      quantity,
      contentCode,
      batchLot,
      prodDate,
      expiryDate,
      custPartNo,
      orderNumber,
    } = req.body;

    // Optional: basic validation
    if (!materialDescription || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const savedItem = await prisma.syringeOrder.create({
      data: {
        materialDescription,
        quantity,
        contentCode,
        batchLot,
        prodDate: new Date(prodDate),
        expiryDate: new Date(expiryDate),
        custPartNo,
        orderNumber,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: savedItem,
    });
  } catch (error) {
    console.error("Error creating product:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.syringeOrder.findMany();
    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const generateQR = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    }

    // 1. Create the link you want the QR code to point to.
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const productUrl = `${baseUrl}/product/${id}`;

    // 2. Generate QR code as a PNG Buffer
    bwipjs.toBuffer(
      {
        bcid: "qrcode", // Barcode type MUST be qrcode for phone scanning
        text: productUrl, // The URL to scan
        scale: 4, // Resolution
      },
      function (err, png) {
        if (err) {
          console.error("bwipjs error:", err);
          return res
            .status(500)
            .json({ success: false, message: "Failed to generate QR code" });
        } else {
          // 3. Return the buffer as an image directly to the browser
          res.setHeader("Content-Type", "image/png");
          res.status(200).send(png);
        }
      },
    );
  } catch (error) {
    console.error("Error generating QR:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const product = await prisma.syringeOrder.findUnique({
      where: { id },
    });
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product by id:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const products = {
  addProducts,
  getAllProducts,
  generateQR,
  getProductById,
};
