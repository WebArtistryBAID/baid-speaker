-- AlterTable
ALTER TABLE "Lecture"
    ADD COLUMN "reclaimable" BOOLEAN NOT NULL DEFAULT false;
