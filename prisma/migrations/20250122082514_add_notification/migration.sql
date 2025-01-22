-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('assignedHost', 'confirmedDate', 'assignedTeacher', 'assignedPosterDesigner', 'submittedPoster', 'approvedPoster', 'createdGroupChat', 'sentAdvertisements', 'teacherApproved', 'confirmedLocation', 'testedDevice', 'updatedLiveAudience', 'submittedFeedback', 'submittedVideo', 'submittedReflection', 'modifiedStatus');

-- CreateTable
CREATE TABLE "Notification"
(
    "id"        SERIAL             NOT NULL,
    "createdAt" TIMESTAMP(3)       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type"      "NotificationType" NOT NULL,
    "values"    TEXT[],
    "userId"    INTEGER            NOT NULL,
    "lectureId" INTEGER,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification"
    ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification"
    ADD CONSTRAINT "Notification_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
