-- AlterTable
ALTER TABLE "User"
    ADD COLUMN "inboxNotifications" "NotificationType"[],
ADD COLUMN     "smsNotifications" "NotificationType"[];
