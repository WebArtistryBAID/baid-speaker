import { NotificationType, PrismaClient, User } from '@prisma/client'
import { getAccessToken } from '@/app/login/login-actions'

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

    if (user.smsNotifications.includes(type)) {
        const template = Object({
            assignedHost: 'SMS_478585457',
            confirmedDate: 'SMS_478535455',
            assignedTeacher: 'SMS_478530425',
            assignedPosterDesigner: 'SMS_478620429',
            submittedPoster: 'SMS_478500448',
            approvedPoster: 'SMS_478410431',
            createdGroupChat: 'SMS_478615482',
            sentAdvertisements: 'SMS_478610444',
            teacherApproved: 'SMS_478590477',
            confirmedLocation: 'SMS_478570450',
            testedDevice: 'SMS_478510427',
            updatedLiveAudience: 'SMS_478625451',
            submittedFeedback: 'SMS_478415465',
            submittedVideo: 'SMS_478410430',
            submittedReflection: 'SMS_478505441',
            modifiedStatus: 'SMS_478390475'
        })[type]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params: any = {
            name: values[0]
        }
        if (type === NotificationType.confirmedDate) {
            const date = new Date(parseInt(values[1]))
            params.date = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
        } else if (type === NotificationType.confirmedLocation) {
            params.location = values[1]
        } else if (type === NotificationType.updatedLiveAudience) {
            params.audience = values[1]
        } else if (type === NotificationType.modifiedStatus) {
            if (values[1] === 'completed') {
                params.status = '已完成'
            } else if (values[1] === 'ready') {
                params.status = '准备就绪'
            } else if (values[1] === 'completingPostTasks') {
                params.status = '完成后续任务'
            }
        }

        await fetch(`${process.env.ONELOGIN_HOST}/api/v1/sms`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${await getAccessToken()}`
            },
            body: JSON.stringify({
                template,
                params
            })
        })
    }
}
