import express, { Application, Request, Response } from "express";
import cors from "cors";
import routes from "./routes";

const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

// application routes

app.use(routes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Apollo Gears World!");
});

export default app;
