import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import obraRoutes from "./routes/obraRoutes.js";
import etapaRoutes from "./routes/etapaRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import relatorioRoutes from "./routes/relatorioRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Build Planning API" });
});

app.use("/auth", authRoutes);
app.use("/usuarios", userRoutes);
app.use("/obras", obraRoutes);
app.use("/etapas", etapaRoutes);
app.use("/materiais", materialRoutes);
app.use("/relatorios", relatorioRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Build Planning rodando na porta ${PORT}`);
});
