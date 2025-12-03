import { authService } from "../services/authService.js";

export const authController = {
  async loginGerente(req, res, next) {
    try {
      const { cnpj, senha } = req.body;
      const result = await authService.loginGerente({ cnpj, senha });
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async loginExecucao(req, res, next) {
    try {
      const { creaCau, senha } = req.body;
      const result = await authService.loginExecucao({ creaCau, senha });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
};
