import { NotificationType, PrismaClient, User } from '@prisma/client'

const prisma = new PrismaClient()

export async function sendNotification(user: User, type: NotificationType, values: string[], lecture: number | null): Promise<void> {
    if (user.inboxNotifications.includes(type)) {
        await prisma.notification.create({
            data: {
                userId: user.id,
                type,
                lectureId: lecture,
                values: values
            }
        })
    }
}
