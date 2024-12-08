-- CreateEnum
CREATE TYPE "PreLectureTasks" AS ENUM ('confirmNeedComPoster', 'confirmPosterDesigner', 'submitPoster', 'inviteTeacher', 'submitPresentation', 'teacherApprovePresentation', 'schoolApprovePoster', 'confirmLocation', 'testDevice', 'createGroupChat', 'inviteParticipants', 'sendAdvertisements');

-- CreateEnum
CREATE TYPE "PostLectureTasks" AS ENUM ('updateLiveAudience', 'submitFeedback', 'submitVideo', 'submitReflection');

-- CreateEnum
CREATE TYPE "LectureAuditLogType" AS ENUM ('created', 'assignedHost', 'assignedTeacher', 'confirmedNeedComPoster', 'confirmedSelfDesignPoster', 'assignedPosterDesigner', 'submittedPoster', 'submittedPresentation', 'approvedPoster', 'createdGroupChat', 'invitedParticipants', 'sentAdvertisements', 'teacherApproved', 'confirmedLocation', 'testedDevice', 'updatedLiveAudience', 'submittedFeedback', 'submittedVideo', 'submittedReflection', 'modifiedStatus');

-- CreateEnum
CREATE TYPE "LectureStatus" AS ENUM ('waiting', 'completingPreTasks', 'ready', 'completingPostTasks', 'completed');

-- CreateTable
CREATE TABLE "AvailableDate"
(
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AvailableDate_pkey" PRIMARY KEY ("date")
);

-- CreateTable
CREATE TABLE "LectureAuditLog"
(
    "id"     SERIAL                NOT NULL,
    "time"   TIMESTAMP(3)          NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type"   "LectureAuditLogType" NOT NULL,
    "userId" INTEGER               NOT NULL,
    "values" TEXT[],

    CONSTRAINT "LectureAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lecture"
(
    "id"                INTEGER      NOT NULL,
    "title"             TEXT         NOT NULL,
    "contactWeChat"     TEXT         NOT NULL,
    "preSurveyQ1"       TEXT         NOT NULL,
    "preSurveyQ2"       TEXT         NOT NULL,
    "date"              TIMESTAMP(3) NOT NULL,
    "userId"            INTEGER      NOT NULL,
    "assigneeId"        INTEGER,
    "posterAssigneeId"  INTEGER,
    "needComPoster"     BOOLEAN,
    "assigneeTeacherId" INTEGER,
    "teacherPreFdbk"    TEXT,
    "tasks"             "PreLectureTasks"[],
    "tasksDues"         TIMESTAMP(3)[],
    "postTasks"         "PostLectureTasks"[],
    "postTasksDues"     TIMESTAMP(3)[],
    "uploadedGroupQR"   TEXT,
    "uploadedSlides"    TEXT,
    "uploadedPoster"    TEXT,
    "uploadedVideo"     TEXT,
    "uploadedFeedback"  TEXT,
    "teacherRating"     INTEGER,
    "liveAudience"      INTEGER,
    "videoViews"        INTEGER      NOT NULL DEFAULT 0,
    "videoLikes"        INTEGER      NOT NULL DEFAULT 0,

    CONSTRAINT "Lecture_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LectureAuditLog"
    ADD CONSTRAINT "LectureAuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lecture"
    ADD CONSTRAINT "Lecture_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lecture"
    ADD CONSTRAINT "Lecture_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lecture"
    ADD CONSTRAINT "Lecture_posterAssigneeId_fkey" FOREIGN KEY ("posterAssigneeId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lecture"
    ADD CONSTRAINT "Lecture_assigneeTeacherId_fkey" FOREIGN KEY ("assigneeTeacherId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
