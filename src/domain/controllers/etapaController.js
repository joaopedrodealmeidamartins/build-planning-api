import { etapaService } from "../services/etapaService.js";

export const etapaController = {
  async atualizarStatus(req, res, next) {
    try {
      const obraId = Number(req.params.obraId);
      const { tipo, subEtapa, status, justificativa } = req.body;

      const etapa = await etapaService.atualizarStatus({
        obraId,
        tipo,
        subEtapa,
        status,
        justificativa
      });

      res.json(etapa);
    } catch (err) {
      next(err);
    }
  }
};
