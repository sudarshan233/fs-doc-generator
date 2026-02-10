import express from "express";
import generateRoutes from "./routes/generate.routes";

const app = express();

app.use(express.json());
app.use(generateRoutes);

export default app;
