import { Router } from "express";
import { userController } from "../domain/controllers/userController.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.post("/gerente", userController.criarGerente);
router.post("/execucao", auth(["GERENCIAMENTO"]), userController.criarExecucao);

export default router;
