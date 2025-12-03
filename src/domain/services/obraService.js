import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const obraService = {
  async criarObra(data, gerenteId) {
    const {
      tipoObra,
      endereco,
      creaCauResponsavel,
      cno,
      responsavelId
    } = data;

    const exec = await prisma.usuarioExecucao.findFirst({
      where: { id: responsavelId, empresaId: gerenteId }
    });
    if (!exec) throw new Error("Responsável não encontrado para esta empresa");

    return prisma.obra.create({
      data: {
        tipoObra,
        endereco,
        creaCauResponsavel,
        cno,
        gerenteId,
        responsavelId
      }
    });
  },

  async listarObrasGerente(gerenteId) {
    return prisma.obra.findMany({
      where: { gerenteId },
      include: {
        responsavel: true,
        etapas: true
      }
    });
  },

  async listarObrasExecucao(execId) {
    return prisma.obra.findMany({
      where: { responsavelId: execId },
      include: {
        etapas: true,
        materiaisPedidos: true
      }
    });
  },

  async obterPorId(id, user) {
    const obra = await prisma.obra.findUnique({
      where: { id },
      include: {
        responsavel: true,
        etapas: true,
        materiaisPedidos: { include: { material: true } }
      }
    });
    if (!obra) throw new Error("Obra não encontrada");

    if (user.role === "EXECUCAO" && obra.responsavelId !== user.sub) {
      throw new Error("Acesso negado à obra");
    }

    return obra;
  }
};
