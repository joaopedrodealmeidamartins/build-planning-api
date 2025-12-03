import { relatorioService } from "../services/relatorioService.js";

export const relatorioController = {
  async panoramaObras(req, res, next) {
    try {
      const gerenteId = req.user.sub;
      const relatorio = await relatorioService.panoramaObras(gerenteId);
      res.json(relatorio);
    } catch (err) {
      next(err);
    }
  }
};
