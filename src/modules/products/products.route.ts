import { Router } from "express";
import { products } from "./products.controller";

const productRoute = Router();
productRoute.post("/add-items", products.addProducts);
productRoute.get("/get-items", products.getAllProducts);
productRoute.get("/get-items/:id", products.getProductById);
productRoute.get("/qr/:id", products.generateQR);

export default productRoute;
