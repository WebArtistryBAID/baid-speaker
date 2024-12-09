/*
  Warnings:

  - Added the required column `lectureId` to the `LectureAuditLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LectureAuditLog"
    ADD COLUMN "lectureId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "LectureAuditLog"
    ADD CONSTRAINT "LectureAuditLog_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
