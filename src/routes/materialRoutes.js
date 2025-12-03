import { Router } from "express";
import { materialController } from "../domain/controllers/materialController.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.post("/pedido", auth(["EXECUCAO"]), materialController.registrarPedido);
router.put("/:id/receber", auth(["EXECUCAO", "GERENCIAMENTO"]), materialController.marcarRecebido);

export default router;
