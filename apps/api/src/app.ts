import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {
  AuthRouter,
  GenreRouter,
  MoviesRouter,
  ShowTimeRouter,
  HallRouter,
  SectionRouter,
  SeatRouter,
  ReservationRouter,
} from "./routes/index.routes";

const app: Express = express();

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api", AuthRouter);
app.use("/api", GenreRouter);
app.use("/api", MoviesRouter);
app.use("/api", ShowTimeRouter);
app.use("/api", HallRouter);
app.use("/api", SectionRouter);
app.use("/api", SeatRouter);
app.use("/api", ReservationRouter);

export default app;

