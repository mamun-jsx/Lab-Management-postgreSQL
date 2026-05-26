import { Router } from "express";
import { products } from "./products.controller";
import auth from "../../middlewares/auth";

const productRoute = Router();

productRoute.post("/add-items", auth("ADMIN", "USER"), products.addProducts);
productRoute.get("/get-items", auth("ADMIN", "USER"), products.getAllProducts);
productRoute.get("/get-items/:id", auth("ADMIN", "USER"), products.getProductById);
productRoute.get("/qr/:id", products.generateQR);

export default productRoute;
