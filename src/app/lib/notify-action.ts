import { NotificationType, PrismaClient, User } from '@/generated/prisma/client'

export async function sendNotification(user: User, type: NotificationType, values: string[], lecture: number | null): Promise<void> {
}
