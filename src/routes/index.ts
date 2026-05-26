import { Router } from "express";
import productRoute from "../modules/products/products.route";
import userRoute from "../modules/users/users.route";

const routes = Router();

routes.use("/api", productRoute);
routes.use("/api/users", userRoute);

export default routes;
