/*
  Warnings:

  - Added the required column `password` to the `Restaurants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Restaurants` ADD COLUMN `password` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Users` ADD COLUMN `password` VARCHAR(191) NOT NULL;
