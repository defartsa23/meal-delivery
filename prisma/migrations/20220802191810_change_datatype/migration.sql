/*
  Warnings:

  - Changed the type of `open` on the `Hours` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `close` on the `Hours` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `Hours` DROP COLUMN `open`,
    ADD COLUMN `open` INTEGER NOT NULL,
    DROP COLUMN `close`,
    ADD COLUMN `close` INTEGER NOT NULL;
