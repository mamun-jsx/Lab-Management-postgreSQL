import { Router } from "express";
import { UserControllers } from "./users.controller";
import auth from "../../middlewares/auth";

const userRoute = Router();

// Public login endpoint
userRoute.post("/login", UserControllers.loginUser);

// CRUD operations mapping (restricted to ADMIN/USER role appropriately)
userRoute.post("/", auth("ADMIN"), UserControllers.createUser);
userRoute.get("/", auth("ADMIN", "USER"), UserControllers.getAllUsers);
userRoute.get("/:id", auth("ADMIN", "USER"), UserControllers.getUserById);
userRoute.put("/:id", auth("ADMIN", "USER"), UserControllers.updateUser);
userRoute.delete("/:id", auth("ADMIN"), UserControllers.deleteUser);

export default userRoute;
