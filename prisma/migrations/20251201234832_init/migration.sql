-- CreateEnum
CREATE TYPE "Role" AS ENUM ('GERENCIAMENTO', 'EXECUCAO');

-- CreateEnum
CREATE TYPE "TipoObra" AS ENUM ('RESIDENCIAL', 'COMERCIAL', 'INDUSTRIAL', 'OUTRA');

-- CreateEnum
CREATE TYPE "EtapaTipo" AS ENUM ('FUNDACAO', 'ALVENARIA', 'COBERTURA', 'INSTALACOES');

-- CreateEnum
CREATE TYPE "SubEtapaTipo" AS ENUM ('TERRAPLANAGEM', 'PERFURACOES', 'VIGA_BALDRAME', 'PILARES', 'VIGA_COROAMENTO', 'LAJE', 'INST_ELETRICAS', 'INST_HIDRAULICAS');

-- CreateEnum
CREATE TYPE "StatusEtapa" AS ENUM ('EM_ANDAMENTO', 'FINALIZADO');

-- CreateEnum
CREATE TYPE "TipoJustificativa" AS ENUM ('CHUVA', 'FALHA_PROJETO', 'ATRASO_MATERIAIS', 'OUTRO');

-- CreateEnum
CREATE TYPE "StatusPedido" AS ENUM ('PENDENTE', 'PEDIDO_FEITO', 'PEDIDO_RECEBIDO');

-- CreateTable
CREATE TABLE "UsuarioGerenciamento" (
    "id" SERIAL NOT NULL,
    "razaoSocial" TEXT NOT NULL,
    "inscricaoEstadual" TEXT,
    "cnpj" TEXT NOT NULL,
    "dataFundacao" TIMESTAMP(3),
    "telefone" TEXT,
    "email" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'GERENCIAMENTO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsuarioGerenciamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioExecucao" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "creaCau" TEXT NOT NULL,
    "telefone" TEXT,
    "email" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3),
    "senhaHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'EXECUCAO',
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "UsuarioExecucao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Obra" (
    "id" SERIAL NOT NULL,
    "tipoObra" "TipoObra" NOT NULL,
    "endereco" TEXT NOT NULL,
    "creaCauResponsavel" TEXT NOT NULL,
    "cno" TEXT NOT NULL,
    "gerenteId" INTEGER NOT NULL,
    "responsavelId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Obra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JustificativaAtraso" (
    "id" SERIAL NOT NULL,
    "tipo" "TipoJustificativa" NOT NULL,
    "descricao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JustificativaAtraso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EtapaObra" (
    "id" SERIAL NOT NULL,
    "obraId" INTEGER NOT NULL,
    "tipo" "EtapaTipo" NOT NULL,
    "subEtapa" "SubEtapaTipo",
    "status" "StatusEtapa" NOT NULL DEFAULT 'EM_ANDAMENTO',
    "dataPrevistaInicio" TIMESTAMP(3),
    "dataPrevistaFim" TIMESTAMP(3),
    "dataRealInicio" TIMESTAMP(3),
    "dataRealFim" TIMESTAMP(3),
    "justificativaId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EtapaObra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "etapaDefault" "EtapaTipo",
    "unidade" TEXT NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialObra" (
    "id" SERIAL NOT NULL,
    "obraId" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,
    "etapa" "EtapaTipo" NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "statusPedido" "StatusPedido" NOT NULL DEFAULT 'PENDENTE',
    "dataPedido" TIMESTAMP(3),
    "dataEntrega" TIMESTAMP(3),

    CONSTRAINT "MaterialObra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LembreteMaterial" (
    "id" SERIAL NOT NULL,
    "obraId" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,
    "etapa" "EtapaTipo" NOT NULL,
    "dataLembrete" TIMESTAMP(3) NOT NULL,
    "enviado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LembreteMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioGerenciamento_cnpj_key" ON "UsuarioGerenciamento"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioGerenciamento_email_key" ON "UsuarioGerenciamento"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioExecucao_cpf_key" ON "UsuarioExecucao"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioExecucao_creaCau_key" ON "UsuarioExecucao"("creaCau");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioExecucao_email_key" ON "UsuarioExecucao"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Obra_cno_key" ON "Obra"("cno");

-- AddForeignKey
ALTER TABLE "UsuarioExecucao" ADD CONSTRAINT "UsuarioExecucao_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "UsuarioGerenciamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Obra" ADD CONSTRAINT "Obra_gerenteId_fkey" FOREIGN KEY ("gerenteId") REFERENCES "UsuarioGerenciamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Obra" ADD CONSTRAINT "Obra_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "UsuarioExecucao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EtapaObra" ADD CONSTRAINT "EtapaObra_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "Obra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EtapaObra" ADD CONSTRAINT "EtapaObra_justificativaId_fkey" FOREIGN KEY ("justificativaId") REFERENCES "JustificativaAtraso"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialObra" ADD CONSTRAINT "MaterialObra_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "Obra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialObra" ADD CONSTRAINT "MaterialObra_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LembreteMaterial" ADD CONSTRAINT "LembreteMaterial_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "Obra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LembreteMaterial" ADD CONSTRAINT "LembreteMaterial_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
