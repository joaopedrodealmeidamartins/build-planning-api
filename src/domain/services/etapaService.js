import { PrismaClient, StatusEtapa } from "@prisma/client";

const prisma = new PrismaClient();

export const etapaService = {
  async atualizarStatus({ obraId, tipo, subEtapa, status, justificativa }) {
    let etapa = await prisma.etapaObra.findFirst({
      where: { obraId, tipo, subEtapa }
    });

    if (!etapa) {
      etapa = await prisma.etapaObra.create({
        data: {
          obraId,
          tipo,
          subEtapa,
          status,
          dataRealInicio: new Date()
        }
      });
    }

    const dataUpdate = {
      status,
      dataRealFim: status === StatusEtapa.FINALIZADO ? new Date() : etapa.dataRealFim
    };

    if (justificativa) {
      const just = await prisma.justificativaAtraso.create({
        data: {
          tipo: justificativa.tipo,
          descricao: justificativa.descricao
        }
      });
      dataUpdate.justificativaId = just.id;
    }

    return prisma.etapaObra.update({
      where: { id: etapa.id },
      data: dataUpdate
    });
  }
};
