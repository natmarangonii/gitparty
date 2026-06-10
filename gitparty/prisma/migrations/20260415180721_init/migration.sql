/*
  Warnings:

  - Made the column `eventosId` on table `inscricoes` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `inscricoes` DROP FOREIGN KEY `Inscricoes_eventosId_fkey`;

-- DropIndex
DROP INDEX `Inscricoes_eventosId_fkey` ON `inscricoes`;

-- AlterTable
ALTER TABLE `inscricoes` MODIFY `eventosId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Imagem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomeOriginal` VARCHAR(191) NOT NULL,
    `nomeArquivo` VARCHAR(191) NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `eventosId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Inscricoes` ADD CONSTRAINT `Inscricoes_eventosId_fkey` FOREIGN KEY (`eventosId`) REFERENCES `Eventos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Imagem` ADD CONSTRAINT `Imagem_eventosId_fkey` FOREIGN KEY (`eventosId`) REFERENCES `Eventos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
