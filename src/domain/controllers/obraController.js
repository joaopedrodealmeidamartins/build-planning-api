import { obraService } from "../services/obraService.js";

export const obraController = {
  async criar(req, res, next) {
    try {
      const gerenteId = req.user.sub;
      const obra = await obraService.criarObra(req.body, gerenteId);
      res.status(201).json(obra);
    } catch (err) {
      next(err);
    }
  },

  async listar(req, res, next) {
    try {
      const user = req.user;
      let obras;
      if (user.role === "GERENCIAMENTO") {
        obras = await obraService.listarObrasGerente(user.sub);
      } else {
        obras = await obraService.listarObrasExecucao(user.sub);
      }
      res.json(obras);
    } catch (err) {
      next(err);
    }
  },

  async obterPorId(req, res, next) {
    try {
      const obra = await obraService.obterPorId(Number(req.params.id), req.user);
      res.json(obra);
    } catch (err) {
      next(err);
    }
  }
};
