import express, { type Express } from "express";
import { AuthRouter, GenreRouter, userRouter } from "./routes/index.routes";
const app: Express = express();

app.use(express.json());

app.use("/api", AuthRouter);
app.use("/api", GenreRouter);
app.use("/api", userRouter);

export default app;
