import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const userService = {
  async criarGerente(data) {
    const {
      razaoSocial,
      inscricaoEstadual,
      cnpj,
      dataFundacao,
      telefone,
      email,
      endereco,
      senha
    } = data;

    const hash = await bcrypt.hash(senha, 10);

    return prisma.usuarioGerenciamento.create({
      data: {
        razaoSocial,
        inscricaoEstadual,
        cnpj,
        dataFundacao: dataFundacao ? new Date(dataFundacao) : null,
        telefone,
        email,
        endereco,
        senhaHash: hash
      }
    });
  },

  async criarExecucao(data, gerenteId) {
    const {
      nome,
      cpf,
      endereco,
      creaCau,
      telefone,
      email,
      dataNascimento,
      senha
    } = data;

    const hash = await bcrypt.hash(senha, 10);

    return prisma.usuarioExecucao.create({
      data: {
        nome,
        cpf,
        endereco,
        creaCau,
        telefone,
        email,
        dataNascimento: dataNascimento ? new Date(dataNascimento) : null,
        senhaHash: hash,
        empresaId: gerenteId
      }
    });
  }
};
