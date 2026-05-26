import { Router } from "express";
import { UserControllers } from "./users.controller";

const userRoute = Router();

// CRUD operations mapping
userRoute.post("/", UserControllers.createUser);
userRoute.get("/", UserControllers.getAllUsers);
userRoute.get("/:id", UserControllers.getUserById);
userRoute.put("/:id", UserControllers.updateUser);
userRoute.delete("/:id", UserControllers.deleteUser);

export default userRoute;
