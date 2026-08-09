import express, { type Express, type Request, type Response } from "express";
import userRouter from "./routes/user.routes.ts";
const app: Express = express();

app.use("/api", userRouter);

app.listen(3000);
