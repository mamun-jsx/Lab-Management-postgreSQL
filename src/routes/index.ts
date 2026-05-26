import { Router } from "express";
import productRoute from "../modules/products/products.route";
const routes = Router();
routes.use("/api", productRoute);

export default routes;
