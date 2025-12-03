import { Router } from "express";
import { authController } from "../domain/controllers/authController.js";

const router = Router();

router.post("/login/gerente", authController.loginGerente);
router.post("/login/execucao", authController.loginExecucao);

export default router;
