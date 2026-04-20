/*
  Warnings:

  - A unique constraint covering the columns `[invoicePrefix]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "invoicePrefix" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_invoicePrefix_key" ON "User"("invoicePrefix");
