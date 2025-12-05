// tests/__mocks__/@prisma/client.js

// jest.fn() está disponível globalmente nos testes
const prismaMock = {
  etapaObra: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  },
  justificativaAtraso: {
    create: jest.fn()
  },
  material: {
    create: jest.fn(),
    findMany: jest.fn()
  },
  materialObra: {
    create: jest.fn(),
    update: jest.fn()
  }
};

class PrismaClient {
  constructor() {
    return prismaMock;
  }
}

// Enums – ajuste os nomes se no teu schema forem diferentes
const StatusEtapa = {
  EM_ANDAMENTO: "EM_ANDAMENTO",
  FINALIZADO: "FINALIZADO"
};

const StatusPedido = {
  PEDIDO_FEITO: "PEDIDO_FEITO",
  PEDIDO_RECEBIDO: "PEDIDO_RECEBIDO"
};

module.exports = {
  PrismaClient,
  StatusEtapa,
  StatusPedido,
  __prismaMock: prismaMock
};
