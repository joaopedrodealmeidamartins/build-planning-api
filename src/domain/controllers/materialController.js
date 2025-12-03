import { materialService } from "../services/materialService.js";

export const materialController = {
  async registrarPedido(req, res, next) {
    try {
      const { obraId, materialId, etapa, quantidade } = req.body;
      const pedido = await materialService.registrarPedido({
        obraId,
        materialId,
        etapa,
        quantidade
      });
      res.status(201).json(pedido);
    } catch (err) {
      next(err);
    }
  },

  async marcarRecebido(req, res, next) {
    try {
      const id = Number(req.params.id);
      const item = await materialService.marcarRecebido(id);
      res.json(item);
    } catch (err) {
      next(err);
    }
  }
};
