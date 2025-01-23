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
            assignedHost: 'SMS_478435414',
            confirmedDate: 'SMS_478545395',
            assignedTeacher: 'SMS_478645258',
            assignedPosterDesigner: 'SMS_478570397',
            submittedPoster: 'SMS_478600350',
            approvedPoster: 'SMS_478535393',
            createdGroupChat: 'SMS_478470393',
            sentAdvertisements: 'SMS_478525388',
            teacherApproved: 'SMS_478540373',
            confirmedLocation: 'SMS_478560408',
            testedDevice: 'SMS_478550384',
            updatedLiveAudience: 'SMS_478480411',
            submittedFeedback: 'SMS_478535394',
            submittedVideo: 'SMS_478520398',
            submittedReflection: 'SMS_478430390',
            modifiedStatus: 'SMS_478575429'
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
                params.status = '完成'
            } else if (values[1] === 'ready') {
                params.status = '准备开始'
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
