import { PrismaClient, StatusPedido } from "@prisma/client";

const prisma = new PrismaClient();

export const materialService = {
  async criarMaterial({ nome, unidade, etapaDefault }) {
    return prisma.material.create({
      data: {
        nome,
        unidade,
        etapaDefault: etapaDefault || null,
      },
    });
  },

  // 👉 LISTAR CATÁLOGO DE MATERIAIS
  async listarMateriais() {
    return prisma.material.findMany({
      orderBy: { nome: "asc" },
    });
  },

  async registrarPedido({ obraId, materialId, etapa, quantidade }) {
    return prisma.materialObra.create({
      data: {
        obraId,
        materialId,
        etapa,
        quantidade,
        statusPedido: StatusPedido.PEDIDO_FEITO,
        dataPedido: new Date()
      }
    });
  },

  async marcarRecebido(id) {
    return prisma.materialObra.update({
      where: { id },
      data: {
        statusPedido: StatusPedido.PEDIDO_RECEBIDO,
        dataEntrega: new Date()
      }
    });
  }
};
