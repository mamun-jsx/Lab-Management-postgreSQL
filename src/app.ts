import express, { Application, Request, Response } from "express";
import cors from "cors";
import routes from "./routes";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFound from "./middlewares/notFound";

const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

// application routes
app.use(routes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Apollo Gears World!");
});

// global error handler middleware
app.use(globalErrorHandler);

// 404 handler middleware
app.use(notFound);

export default app;
