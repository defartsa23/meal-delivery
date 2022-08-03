/*
  Warnings:

  - You are about to alter the column `open` on the `Hours` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedMediumInt`.
  - You are about to alter the column `close` on the `Hours` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedMediumInt`.
  - Added the required column `closeFilter` to the `Hours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `indexOfDay` to the `Hours` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Hours` ADD COLUMN `closeFilter` MEDIUMINT UNSIGNED NOT NULL,
    ADD COLUMN `indexOfDay` TINYINT UNSIGNED NOT NULL,
    MODIFY `open` MEDIUMINT UNSIGNED NOT NULL,
    MODIFY `close` MEDIUMINT UNSIGNED NOT NULL;
