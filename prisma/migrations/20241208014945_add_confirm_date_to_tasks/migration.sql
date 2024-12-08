-- AlterEnum
ALTER TYPE "LectureAuditLogType" ADD VALUE 'confirmedDate';

-- AlterEnum
ALTER TYPE "PreLectureTasks" ADD VALUE 'confirmDate';

-- AlterTable
ALTER TABLE "Lecture"
    ALTER COLUMN "date" DROP NOT NULL;
