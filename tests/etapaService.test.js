// tests/etapaService.test.js
jest.mock("@prisma/client");

const { __prismaMock, StatusEtapa } = require("@prisma/client");
const { etapaService } = require("../src/domain/services/etapaService.js");

describe("etapaService.atualizarStatus", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve criar uma nova etapa quando não existir e atualizar status", async () => {
    // 1) findFirst não encontra nada
    __prismaMock.etapaObra.findFirst.mockResolvedValue(null);

    // 2) create cria a etapa básica
    __prismaMock.etapaObra.create.mockResolvedValue({
      id: 1,
      obraId: 10,
      tipo: "FUNDACAO",
      subEtapa: null,
      status: StatusEtapa.EM_ANDAMENTO,
      dataRealInicio: new Date("2025-01-01")
    });

    // 3) update retorna a etapa finalizada
    __prismaMock.etapaObra.update.mockResolvedValue({
      id: 1,
      obraId: 10,
      tipo: "FUNDACAO",
      subEtapa: null,
      status: StatusEtapa.FINALIZADO
    });

    const result = await etapaService.atualizarStatus({
      obraId: 10,
      tipo: "FUNDACAO",
      subEtapa: null,
      status: StatusEtapa.FINALIZADO,
      justificativa: null
    });

    // valida que tentou achar a etapa
    expect(__prismaMock.etapaObra.findFirst).toHaveBeenCalledWith({
      where: { obraId: 10, tipo: "FUNDACAO", subEtapa: null }
    });

    // como não achou, criou
    expect(__prismaMock.etapaObra.create).toHaveBeenCalledWith({
      data: {
        obraId: 10,
        tipo: "FUNDACAO",
        subEtapa: null,
        status: StatusEtapa.FINALIZADO, // valor passado na chamada
        dataRealInicio: expect.any(Date)
      }
    });

    // e depois atualizou
    expect(__prismaMock.etapaObra.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: expect.objectContaining({
        status: StatusEtapa.FINALIZADO,
        dataRealFim: expect.any(Date) // porque FINALIZADO
      })
    });

    expect(result.status).toBe(StatusEtapa.FINALIZADO);
  });

  test("deve usar etapa existente e criar justificativa quando enviada", async () => {
    // 1) findFirst encontra uma etapa já existente
    __prismaMock.etapaObra.findFirst.mockResolvedValue({
      id: 2,
      obraId: 20,
      tipo: "ALVENARIA",
      subEtapa: "PAREDES",
      status: StatusEtapa.EM_ANDAMENTO,
      dataRealFim: null
    });

    // 2) justificativa é criada
    __prismaMock.justificativaAtraso.create.mockResolvedValue({
      id: 99,
      tipo: "CHUVA",
      descricao: "Choveu a semana inteira"
    });

    // 3) update aplica status finalizado + justificativa
    __prismaMock.etapaObra.update.mockResolvedValue({
      id: 2,
      obraId: 20,
      tipo: "ALVENARIA",
      subEtapa: "PAREDES",
      status: StatusEtapa.FINALIZADO,
      justificativaId: 99
    });

    const result = await etapaService.atualizarStatus({
      obraId: 20,
      tipo: "ALVENARIA",
      subEtapa: "PAREDES",
      status: StatusEtapa.FINALIZADO,
      justificativa: {
        tipo: "CHUVA",
        descricao: "Choveu a semana inteira"
      }
    });

    // não criou etapa nova, só usou a existente
    expect(__prismaMock.etapaObra.create).not.toHaveBeenCalled();

    expect(__prismaMock.justificativaAtraso.create).toHaveBeenCalledWith({
      data: {
        tipo: "CHUVA",
        descricao: "Choveu a semana inteira"
      }
    });

    expect(__prismaMock.etapaObra.update).toHaveBeenCalledWith({
      where: { id: 2 },
      data: expect.objectContaining({
        status: StatusEtapa.FINALIZADO,
        dataRealFim: expect.any(Date),
        justificativaId: 99
      })
    });

    expect(result.justificativaId).toBe(99);
  });
});
