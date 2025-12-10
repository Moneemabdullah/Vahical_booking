import express from "express";
import initDb from "./config/db";
import mainRoutes from "./main.routes";

const app = express();
app.use(express.json());

initDb();

app.use("/api", mainRoutes);

export default app;
