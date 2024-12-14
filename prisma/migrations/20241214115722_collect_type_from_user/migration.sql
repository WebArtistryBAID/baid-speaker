/*
  Warnings:

  - Added the required column `type` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('student', 'teacher');

-- AlterTable
ALTER TABLE "User"
    ADD COLUMN "type" "UserType" NOT NULL;
