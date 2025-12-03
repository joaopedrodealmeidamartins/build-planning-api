import { Router } from "express";
import { relatorioController } from "../domain/controllers/relatorioController.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.get("/panorama-obras", auth(["GERENCIAMENTO"]), relatorioController.panoramaObras);

export default router;
