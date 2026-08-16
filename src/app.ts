import express, { type Express } from "express";
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

