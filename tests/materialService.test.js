// tests/materialService.test.js

// Usa o mock automático de @prisma/client definido em tests/__mocks__/@prisma/client.js
jest.mock("@prisma/client");

const { __prismaMock, StatusPedido } = require("@prisma/client");
const { materialService } = require("../src/domain/services/materialService.js");

describe("materialService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("criarMaterial deve salvar um novo material", async () => {
    __prismaMock.material.create.mockResolvedValue({
      id: 1,
      nome: "Cimento CP-II 50kg",
      unidade: "saco",
      etapaDefault: "FUNDACAO"
    });

    const result = await materialService.criarMaterial({
      nome: "Cimento CP-II 50kg",
      unidade: "saco",
      etapaDefault: "FUNDACAO"
    });

    expect(__prismaMock.material.create).toHaveBeenCalledWith({
      data: {
        nome: "Cimento CP-II 50kg",
        unidade: "saco",
        etapaDefault: "FUNDACAO"
      }
    });

    expect(result.id).toBe(1);
  });

  test("listarMateriais deve retornar lista ordenada", async () => {
    __prismaMock.material.findMany.mockResolvedValue([
      { id: 1, nome: "Areia fina", unidade: "m³" },
      { id: 2, nome: "Brita 1", unidade: "m³" }
    ]);

    const result = await materialService.listarMateriais();

    expect(__prismaMock.material.findMany).toHaveBeenCalledWith({
      orderBy: { nome: "asc" }
    });

    expect(result).toHaveLength(2);
  });

  test("registrarPedido deve criar registro em materialObra com status PEDIDO_FEITO", async () => {
    __prismaMock.materialObra.create.mockResolvedValue({
      id: 10,
      obraId: 5,
      materialId: 1,
      quantidade: 20,
      etapa: "FUNDACAO",
      statusPedido: StatusPedido.PEDIDO_FEITO
    });

    const result = await materialService.registrarPedido({
      obraId: 5,
      materialId: 1,
      etapa: "FUNDACAO",
      quantidade: 20
    });

    expect(__prismaMock.materialObra.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        obraId: 5,
        materialId: 1,
        etapa: "FUNDACAO",
        quantidade: 20,
        statusPedido: StatusPedido.PEDIDO_FEITO,
        dataPedido: expect.any(Date)
      })
    });

    expect(result.statusPedido).toBe(StatusPedido.PEDIDO_FEITO);
  });

  test("marcarRecebido deve atualizar status para PEDIDO_RECEBIDO", async () => {
    __prismaMock.materialObra.update.mockResolvedValue({
      id: 10,
      statusPedido: StatusPedido.PEDIDO_RECEBIDO
    });

    const result = await materialService.marcarRecebido(10);

    expect(__prismaMock.materialObra.update).toHaveBeenCalledWith({
      where: { id: 10 },
      data: expect.objectContaining({
        statusPedido: StatusPedido.PEDIDO_RECEBIDO,
        dataEntrega: expect.any(Date)
      })
    });

    expect(result.statusPedido).toBe(StatusPedido.PEDIDO_RECEBIDO);
  });
});
