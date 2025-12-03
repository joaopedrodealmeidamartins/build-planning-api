import { Router } from "express";
import { obraController } from "../domain/controllers/obraController.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.post("/", auth(["GERENCIAMENTO"]), obraController.criar);
router.get("/", auth(["GERENCIAMENTO", "EXECUCAO"]), obraController.listar);
router.get("/:id", auth(["GERENCIAMENTO", "EXECUCAO"]), obraController.obterPorId);

export default router;
