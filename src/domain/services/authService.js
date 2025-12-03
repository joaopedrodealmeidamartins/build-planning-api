import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const authService = {
  async loginGerente({ cnpj, senha }) {
    const user = await prisma.usuarioGerenciamento.findUnique({ where: { cnpj } });
    if (!user) throw new Error("Usuário não encontrado");

    const isValid = await bcrypt.compare(senha, user.senhaHash);
    if (!isValid) throw new Error("Credenciais inválidas");

    const token = jwt.sign(
      { sub: user.id, role: "GERENCIAMENTO", tipo: "GERENTE" },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return {
      token,
      usuario: { id: user.id, razaoSocial: user.razaoSocial, role: "GERENCIAMENTO" }
    };
  },

  async loginExecucao({ creaCau, senha }) {
    const user = await prisma.usuarioExecucao.findUnique({ where: { creaCau } });
    if (!user) throw new Error("Usuário não encontrado");

    const isValid = await bcrypt.compare(senha, user.senhaHash);
    if (!isValid) throw new Error("Credenciais inválidas");

    const token = jwt.sign(
      { sub: user.id, role: "EXECUCAO", tipo: "EXECUCAO" },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return {
      token,
      usuario: { id: user.id, nome: user.nome, role: "EXECUCAO" }
    };
  }
};
