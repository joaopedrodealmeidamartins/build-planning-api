import { userService } from "../services/userService.js";

export const userController = {
  async criarGerente(req, res, next) {
    try {
      const gerente = await userService.criarGerente(req.body);
      res.status(201).json(gerente);
    } catch (err) {
      next(err);
    }
  },

  async criarExecucao(req, res, next) {
    try {
      const gerenteId = req.user.sub;
      const execucao = await userService.criarExecucao(req.body, gerenteId);
      res.status(201).json(execucao);
    } catch (err) {
      next(err);
    }
  }
};
