-- AlterTable
ALTER TABLE "User"
    ALTER COLUMN "inboxNotifications" SET DEFAULT ARRAY['assignedHost', 'confirmedDate', 'assignedTeacher', 'assignedPosterDesigner', 'submittedPoster', 'approvedPoster', 'createdGroupChat', 'sentAdvertisements', 'teacherApproved', 'confirmedLocation', 'testedDevice', 'updatedLiveAudience', 'submittedFeedback', 'submittedVideo', 'submittedReflection', 'modifiedStatus']::"NotificationType"[],
ALTER
COLUMN "smsNotifications" SET DEFAULT ARRAY['assignedHost', 'assignedTeacher', 'submittedPoster', 'approvedPoster', 'teacherApproved', 'modifiedStatus', 'submittedVideo']::"NotificationType"[];

-- CreateTable
CREATE TABLE "OATokens"
(
    "id"           SERIAL  NOT NULL,
    "accessToken"  TEXT    NOT NULL,
    "refreshToken" TEXT    NOT NULL,
    "userId"       INTEGER NOT NULL,

    CONSTRAINT "OATokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OATokens_userId_key" ON "OATokens" ("userId");

-- AddForeignKey
ALTER TABLE "OATokens"
    ADD CONSTRAINT "OATokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
