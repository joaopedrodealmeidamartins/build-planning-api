import { materialService } from "../services/materialService.js";

export const materialController = {
  // POST /materiais/catalogo
  async criarMaterial(req, res, next) {
    try {
      const { nome, unidade, etapaDefault } = req.body;

      if (!nome || !unidade) {
        return res
          .status(400)
          .json({ message: "Nome e unidade do material são obrigatórios." });
      }

      const material = await materialService.criarMaterial({
        nome,
        unidade,
        etapaDefault,
      });

      res.status(201).json(material);
    } catch (error) {
      next(error);
    }
  },

  // GET /materiais/catalogo
  async listarMateriais(req, res, next) {
    try {
      const materiais = await materialService.listarMateriais();
      res.json(materiais);
    } catch (error) {
      next(error);
    }
  },

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
