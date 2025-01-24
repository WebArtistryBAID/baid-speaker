/*
  Warnings:

  - You are about to drop the column `videoLikes` on the `Lecture` table. All the data in the column will be lost.
  - You are about to drop the column `videoViews` on the `Lecture` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Lecture" DROP COLUMN "videoLikes",
DROP
COLUMN "videoViews",
ADD COLUMN     "likedUsers" INTEGER[],
ADD COLUMN     "viewedUsers" INTEGER[];

-- AlterTable
ALTER TABLE "User"
    ALTER COLUMN "smsNotifications" SET DEFAULT ARRAY['assignedHost', 'confirmedDate', 'assignedTeacher', 'submittedPoster', 'approvedPoster', 'teacherApproved', 'modifiedStatus', 'submittedVideo']::"NotificationType"[];
