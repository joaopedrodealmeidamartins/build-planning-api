import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const relatorioService = {
  async panoramaObras(gerenteId) {
    const obras = await prisma.obra.findMany({
      where: { gerenteId },
      include: {
        responsavel: true,
        etapas: true
      }
    });

    const totalObras = obras.length;
    const porEtapa = {};

    for (const obra of obras) {
      for (const etapa of obra.etapas) {
        const key = etapa.tipo;
        porEtapa[key] = (porEtapa[key] || 0) + 1;
      }
    }

    return { totalObras, porEtapa, obras };
  }
};
