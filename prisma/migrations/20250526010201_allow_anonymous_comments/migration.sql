-- AlterTable
ALTER TABLE "Comment"
    ADD COLUMN "anonymous" BOOLEAN NOT NULL DEFAULT false;
