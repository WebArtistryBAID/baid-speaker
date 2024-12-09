/*
  Warnings:

  - You are about to drop the column `postTasks` on the `Lecture` table. All the data in the column will be lost.
  - You are about to drop the column `postTasksDues` on the `Lecture` table. All the data in the column will be lost.
  - You are about to drop the column `tasks` on the `Lecture` table. All the data in the column will be lost.
  - You are about to drop the column `tasksDues` on the `Lecture` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "LectureTasks" AS ENUM ('confirmDate', 'confirmNeedComPoster', 'confirmPosterDesigner', 'submitPoster', 'inviteTeacher', 'submitPresentation', 'teacherApprovePresentation', 'schoolApprovePoster', 'confirmLocation', 'testDevice', 'createGroupChat', 'inviteParticipants', 'sendAdvertisements', 'updateLiveAudience', 'submitFeedback', 'submitVideo', 'submitReflection');

-- AlterTable
ALTER TABLE "Lecture" DROP COLUMN "postTasks",
DROP
COLUMN "postTasksDues",
DROP
COLUMN "tasks",
DROP
COLUMN "tasksDues",
ADD COLUMN     "posterApproved" BOOLEAN,
ADD COLUMN     "slidesApproved" BOOLEAN;

-- DropEnum
DROP TYPE "PostLectureTasks";

-- DropEnum
DROP TYPE "PreLectureTasks";

-- CreateTable
CREATE TABLE "LectureTask"
(
    "id"          SERIAL         NOT NULL,
    "type"        "LectureTasks" NOT NULL,
    "assigneeId"  INTEGER        NOT NULL,
    "lectureId"   INTEGER        NOT NULL,
    "createdAt"   TIMESTAMP(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3)   NOT NULL,
    "dueAt"       TIMESTAMP(3)   NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "LectureTask_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LectureTask"
    ADD CONSTRAINT "LectureTask_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LectureTask"
    ADD CONSTRAINT "LectureTask_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
