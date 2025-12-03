import { Router } from "express";
import { etapaController } from "../domain/controllers/etapaController.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.put("/obra/:obraId/status", auth(["EXECUCAO"]), etapaController.atualizarStatus);

export default router;
