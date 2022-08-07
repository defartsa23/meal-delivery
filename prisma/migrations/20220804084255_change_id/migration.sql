/*
  Warnings:

  - The primary key for the `Orders` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `Orders` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`userId`, `menuId`, `createdAt`);
