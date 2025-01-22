'use server'

import {
    Lecture,
    LectureAuditLogType,
    LectureStatus,
    LectureTasks,
    Prisma,
    PrismaClient,
    User,
    UserType
} from '@prisma/client'
import { requireUser, requireUserPermission } from '@/app/login/login-actions'
import LectureWhereInput = Prisma.LectureWhereInput

const prisma = new PrismaClient()

export interface Paginated<T> {
    items: T[]
    page: number
    pages: number
}

const HydratedLectureInclude = {
    user: {
        select: {
            id: true,
            name: true,
            phone: true
        }
    },
    assignee: {
        select: {
            id: true,
            name: true,
            phone: true
        }
    },
    assigneeTeacher: {
        select: {
            id: true,
            name: true,
            phone: true
        }
    },
    posterAssignee: {
        select: {
            id: true,
            name: true,
            phone: true
        }
    },
    tasks: {
        include: {
            assignee: {
                select: {
                    id: true,
                    name: true,
                    phone: true
                }
            }
        }
    }
}

export interface HydratedLecture {
    id: number
    title: string
    createdAt: Date
    updatedAt: Date
    contactWeChat: string
    preSurveyQ1: string
    preSurveyQ2: string
    date: Date | null
    status: LectureStatus
    user: {
        id: number
        name: string
        phone: string | null
    }
    userId: number
    assignee: {
        id: number
        name: string
        phone: string | null
    } | null
    assigneeId: number | null
    reclaimable: boolean
    assigneeTeacher: {
        id: number
        name: string
        phone: string | null
    } | null
    assigneeTeacherId: number | null
    posterAssignee: {
        id: number
        name: string
        phone: string | null
    } | null
    posterAssigneeId: number | null
    needComPoster: boolean | null
    teacherPreFdbk: string | null
    slidesApproved: boolean | null
    tasks: HydratedLectureTask[]
    posterApproved: boolean | null
    location: string | null
    uploadedGroupQR: string | null
    uploadedSlides: string | null
    uploadedPoster: string | null
    uploadedVideo: string | null
    uploadedFeedback: string | null
    teacherRating: number | null
    liveAudience: number | null
    videoViews: number
    videoLikes: number
}

export interface HydratedLectureTask {
    id: number
    type: LectureTasks
    assignee: {
        id: number
        name: string
        phone: string | null
    }
    lectureId: number
    assigneeId: number
    createdAt: Date
    updatedAt: Date
    dueAt: Date
    completedAt: Date | null
}

export interface HydratedLectureAuditLog {
    id: number
    time: Date
    type: LectureAuditLogType
    user: {
        id: number
        name: string
        phone: string | null
    }
    userId: number
    lectureId: number
    values: string[]
}

export async function canCreateLecture(): Promise<boolean> {
    const user = await requireUser()
    return await prisma.lecture.count({
        where: {
            userId: user.id,
            status: {
                not: LectureStatus.completed
            }
        }
    }) === 0
}

export async function createLecture(title: string, contact: string, surveyQ1: string, surveyQ2: string): Promise<Lecture> {
    const user = await requireUser()
    if (!await canCreateLecture()) {
        throw new Error('Cannot create lecture')
    }
    const lecture = await prisma.lecture.create({
        data: {
            title,
            contactWeChat: contact,
            preSurveyQ1: surveyQ1,
            preSurveyQ2: surveyQ2,
            status: LectureStatus.waiting,
            userId: user.id
        }
    })
    await prisma.lectureAuditLog.create({
        data: {
            type: LectureAuditLogType.created,
            userId: user.id,
            lectureId: lecture.id
        }
    })
    return lecture
}

export async function getMyOwnLatestLecture(): Promise<HydratedLecture | null> {
    const user = await requireUser()
    return prisma.lecture.findFirst({
        where: {
            userId: user.id
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: HydratedLectureInclude
    })
}

export async function getLectures(page: number, filter: LectureWhereInput): Promise<Paginated<HydratedLecture>> {
    await requireUserPermission('admin.manage')
    const pages = Math.ceil(await prisma.lecture.count({ where: filter }) / 10)
    const lectures = await prisma.lecture.findMany({
        where: filter,
        orderBy: {
            updatedAt: 'desc'
        },
        include: HydratedLectureInclude,
        skip: page * 10,
        take: 10
    })
    return {
        items: lectures,
        page,
        pages
    }
}

export async function getMyLectures(page: number): Promise<Paginated<HydratedLecture>> {
    const user = await requireUser()
    const pages = Math.ceil(await prisma.lecture.count({
        where: {
            OR: [
                {
                    userId: user.id
                },
                {
                    assigneeId: user.id
                },
                {
                    assigneeTeacherId: user.id
                },
                {
                    posterAssigneeId: user.id
                }
            ]
        }
    }) / 10)
    const lectures = await prisma.lecture.findMany({
        where: {
            OR: [
                {
                    userId: user.id
                },
                {
                    assigneeId: user.id
                },
                {
                    assigneeTeacherId: user.id
                },
                {
                    posterAssigneeId: user.id
                }
            ]
        },
        orderBy: {
            updatedAt: 'desc'
        },
        include: HydratedLectureInclude,
        skip: page * 10,
        take: 10
    })
    return {
        items: lectures,
        page,
        pages
    }
}

export async function getLecture(id: number): Promise<HydratedLecture | null> {
    await requireUser()
    return prisma.lecture.findUnique({
        where: {
            id
        },
        include: HydratedLectureInclude
    })
}

function daysBefore(d: Date, days: number): Date {
    return new Date(d.getTime() - days * 24 * 60 * 60 * 1000)
}

export async function claimLecture(id: number): Promise<void> {
    const user = await requireUserPermission('admin.manage')
    const lecture = await prisma.lecture.findUnique({
        where: {
            id
        },
        include: HydratedLectureInclude
    })
    if (lecture?.status !== LectureStatus.waiting && !lecture?.reclaimable) {
        throw new Error('Cannot claim lecture')
    }
    const fromReclaimable = lecture.reclaimable
    await prisma.lecture.update({
        where: {
            id
        },
        data: {
            status: LectureStatus.completingPreTasks,
            assigneeId: user.id,
            reclaimable: false
        }
    })
    await prisma.lectureAuditLog.create({
        data: {
            type: LectureAuditLogType.assignedHost,
            userId: user.id,
            lectureId: lecture.id
        }
    })
    await prisma.notification.create({
        data: {
            lectureId: lecture.id,
            userId: lecture.userId,
            type: LectureAuditLogType.createdGroupChat,
            values: [ user.id ]
        }
    })
    if (!fromReclaimable) {
        await prisma.lectureTask.create({
            data: {
                type: LectureTasks.confirmDate,
                assigneeId: user.id,
                lectureId: lecture.id,
                // Due in 14 days
                dueAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
            }
        })
    }
}

export async function getUnassignedLectures(): Promise<HydratedLecture[]> {
    await requireUserPermission('admin.manage')
    return prisma.lecture.findMany({
        where: {
            OR: [
                {
                    status: LectureStatus.waiting
                },
                {
                    reclaimable: true
                }
            ]
        },
        include: HydratedLectureInclude
    })
}

async function requireTaskUser(task: HydratedLectureTask): Promise<User> {
    const user = await requireUser()
    if (task.assigneeId !== user.id) {
        throw new Error('Unauthorized')
    }
    if (task.completedAt != null) {
        throw new Error('Task already completed')
    }
    return user
}

export async function confirmDate(lectureId: number, task: HydratedLectureTask, date: Date): Promise<HydratedLecture> {
    const user = await requireTaskUser(task)
    const lecture = (await prisma.lecture.findUnique({
        where: {
            id: lectureId
        },
        include: HydratedLectureInclude
    }))!
    await prisma.lecture.update({
        where: {
            id: lecture.id
        },
        data: {
            date
        }
    })
    await prisma.lectureTask.delete({
        where: {
            id: task.id
        }
    })
    await prisma.lectureAuditLog.create({
        data: {
            type: LectureAuditLogType.confirmedDate,
            userId: user.id,
            lectureId: lecture.id,
            values: [ date.getTime().toString() ]
        }
    })
    await prisma.notification.create({
        data: {
            lectureId: lecture.id,
            userId: lecture.userId,
            type: LectureAuditLogType.confirmedDate,
            values: [ user.id, date.getTime().toString() ]
        }
    })
    await prisma.lectureTask.create({
        data: {
            type: LectureTasks.confirmNeedComPoster,
            assigneeId: user.id,
            lectureId: lecture.id,
            dueAt: daysBefore(date, 5)
        }
    })
    await prisma.lectureTask.create({
        data: {
            type: LectureTasks.inviteTeacher,
            assigneeId: lecture.assigneeId!,
            lectureId: lecture.id,
            dueAt: daysBefore(date, 5)
        }
    })
    await prisma.lectureTask.create({
        data: {
            type: LectureTasks.submitPresentation,
            assigneeId: user.id,
            lectureId: lecture.id,
            dueAt: daysBefore(date, 3)
        }
    })
    await prisma.lectureTask.create({
        data: {
            type: LectureTasks.confirmLocation,
            assigneeId: lecture.assigneeId!,
            lectureId: lecture.id,
            dueAt: daysBefore(date, 3)
        }
    })
    return lecture
}

export async function confirmNeedComPoster(lectureId: number, task: HydratedLectureTask, needComPoster: boolean): Promise<HydratedLecture> {
    const user = await requireTaskUser(task)
    const lecture = (await prisma.lecture.findUnique({
        where: {
            id: lectureId
        },
        include: HydratedLectureInclude
    }))!
    await prisma.lecture.update({
        where: {
            id: lecture.id
        },
        data: {
            needComPoster
        }
    })
    await prisma.lectureTask.delete({
        where: {
            id: task.id
        }
    })
    await prisma.lectureAuditLog.create({
        data: {
            type: LectureAuditLogType.confirmedNeedComPoster,
            userId: user.id,
            lectureId: lecture.id,
            values: [needComPoster.toString()]
        }
    })
    if (needComPoster) {
        await prisma.lectureTask.create({
            data: {
                type: LectureTasks.confirmPosterDesigner,
                assigneeId: lecture.assigneeId!,
                lectureId: lecture.id,
                dueAt: daysBefore(lecture.date!, 4)
            }
        })
    } else {
        await prisma.lectureTask.create({
            data: {
                type: LectureTasks.submitPoster,
                assigneeId: user.id,
                lectureId: lecture.id,
                dueAt: daysBefore(lecture.date!, 3)
            }
        })
    }
    return lecture
}

export async function confirmPosterDesigner(lectureId: number): Promise<HydratedLecture> {
    const task = await prisma.lectureTask.findFirstOrThrow({
        where: {
            lectureId,
            type: LectureTasks.confirmPosterDesigner
        }
    })

    const user = await requireUser()
    const lecture = (await prisma.lecture.findUnique({
        where: {
            id: lectureId
        },
        include: HydratedLectureInclude
    }))!
    if (lecture.needComPoster !== true) {
        throw new Error('Poster not needed')
    }
    await prisma.lecture.update({
        where: {
            id: lecture.id
        },
        data: {
            posterAssigneeId: user.id
        }
    })
    await prisma.lectureTask.delete({
        where: {
            id: task.id
        }
    })
    await prisma.lectureAuditLog.create({
        data: {
            type: LectureAuditLogType.assignedPosterDesigner,
            userId: user.id,
            lectureId: lecture.id
        }
    })
    await prisma.notification.create({
        data: {
            lectureId: lecture.id,
            userId: lecture.userId,
            type: LectureAuditLogType.assignedPosterDesigner,
            values: [ user.id ]
        }
    })
    await prisma.lectureTask.create({
        data: {
            type: LectureTasks.submitPoster,
            assigneeId: user.id,
            lectureId: lecture.id,
            dueAt: daysBefore(lecture.date!, 3)
        }
    })
    return lecture
}

export async function inviteTeacher(lectureId: number): Promise<HydratedLecture> {
    const task = await prisma.lectureTask.findFirstOrThrow({
        where: {
            lectureId,
            type: LectureTasks.inviteTeacher
        }
    })
    const user = await requireUser()
    if (user.type !== UserType.teacher) {
        throw new Error('That\'s not a teacher!')
    }

    const lecture = (await prisma.lecture.findUnique({
        where: {
            id: lectureId
        },
        include: HydratedLectureInclude
    }))!
    if (lecture.assigneeTeacherId != null) {
        throw new Error('Teacher not needed')
    }
    await prisma.lecture.update({
        where: {
            id: lecture.id
        },
        data: {
            assigneeTeacherId: user.id
        }
    })
    await prisma.lectureTask.delete({
        where: {
            id: task.id
        }
    })
    await prisma.lectureAuditLog.create({
        data: {
            type: LectureAuditLogType.assignedTeacher,
            userId: user.id,
            lectureId: lecture.id
        }
    })
    await prisma.notification.create({
        data: {
            lectureId: lecture.id,
            userId: lecture.userId,
            type: LectureAuditLogType.assignedTeacher,
            values: [ user.id ]
        }
    })
    if (lecture.uploadedSlides != null) {
        await prisma.lectureTask.create({
            data: {
                type: LectureTasks.teacherApprovePresentation,
                assigneeId: lecture.assigneeId!,
                lectureId: lecture.id,
                dueAt: daysBefore(lecture.date!, 1)
            }
        })
    }
    return lecture
}

export async function schoolApprovePoster(lectureId: number): Promise<HydratedLecture> {
    const task = await prisma.lectureTask.findFirstOrThrow({
        where: {
            lectureId,
            type: LectureTasks.schoolApprovePoster
        }
    })
    const user = await requireUser()
    if (user.type !== UserType.teacher) {
        throw new Error('That\'s not a teacher!')
    }
    const lecture = (await prisma.lecture.findUnique({
        where: {
            id: lectureId
        },
        include: HydratedLectureInclude
    }))!
    await prisma.lecture.update({
        where: {
            id: lecture.id
        },
        data: {
            posterApproved: true
        }
    })
    await prisma.lectureTask.delete({
        where: {
            id: task.id
        }
    })
    await prisma.lectureAuditLog.create({
        data: {
            type: LectureAuditLogType.approvedPoster,
            userId: user.id,
            lectureId: lecture.id
        }
    })
    await prisma.notification.create({
        data: {
            lectureId: lecture.id,
            userId: lecture.userId,
            type: LectureAuditLogType.approvedPoster,
            values: [ user.id ]
        }
    })
    if (lecture.uploadedSlides != null) {
        await prisma.lectureTask.create({
            data: {
                type: LectureTasks.sendAdvertisements,
                assigneeId: lecture.assigneeId!,
                lectureId: lecture.id,
                dueAt: daysBefore(lecture.date!, 1)
            }
        })
    }
    return lecture
}

export async function sendAdvertisements(lectureId: number, task: HydratedLectureTask): Promise<HydratedLecture> {
    const user = await requireTaskUser(task)
    const lecture = (await prisma.lecture.findUnique({
        where: {
            id: lectureId
        },
        include: HydratedLectureInclude
    }))!
    await prisma.lectureTask.delete({
        where: {
            id: task.id
        }
    })
    await prisma.lectureAuditLog.create({
        data: {
            type: LectureAuditLogType.sentAdvertisements,
            userId: user.id,
            lectureId: lecture.id
        }
    })
    await prisma.notification.create({
        data: {
            lectureId: lecture.id,
            userId: lecture.userId,
            type: LectureAuditLogType.sentAdvertisements,
            values: [ user.id ]
        }
    })
    return lecture
}

export async function teacherApprovePresentation(lectureId: number): Promise<HydratedLecture> {
    const task = await prisma.lectureTask.findFirstOrThrow({
        where: {
            lectureId,
            type: LectureTasks.teacherApprovePresentation
        }
    })
    const user = await requireUser()
    const lecture = (await prisma.lecture.findUnique({
        where: {
            id: lectureId
        },
        include: HydratedLectureInclude
    }))!
    if (user.id !== lecture.assigneeTeacherId) {
        throw new Error('Incorrect user')
    }
    await prisma.lecture.update({
        where: {
            id: lecture.id
        },
        data: {
            slidesApproved: true
        }
    })
    await prisma.lectureTask.delete({
        where: {
            id: task.id
        }
    })
    await prisma.lectureAuditLog.create({
        data: {
            type: LectureAuditLogType.teacherApproved,
            userId: user.id,
            lectureId: lecture.id
        }
    })
    await prisma.notification.create({
        data: {
            lectureId: lecture.id,
            userId: lecture.userId,
            type: LectureAuditLogType.teacherApproved,
            values: [ user.id ]
        }
    })
    return lecture
}

export async function inviteParticipants(lectureId: number, task: HydratedLectureTask): Promise<HydratedLecture> {
    const user = await requireTaskUser(task)
    const lecture = (await prisma.lecture.findUnique({
        where: {
            id: lectureId
        },
        include: HydratedLectureInclude
    }))!
    await prisma.lectureTask.delete({
        where: {
            id: task.id
        }
    })
    await prisma.lectureAuditLog.create({
        data: {
            type: LectureAuditLogType.invitedParticipants,
            userId: user.id,
            lectureId: lecture.id
        }
    })
    return lecture
}

export async function confirmLocation(lectureId: number, task: HydratedLectureTask, location: string) {
    const user = await requireTaskUser(task)
    const lecture = (await prisma.lecture.findUnique({
        where: {
            id: lectureId
        },
        include: HydratedLectureInclude
    }))!
    await prisma.lecture.update({
        where: {
            id: lecture.id
        },
        data: {
            location
        }
    })
    await prisma.lectureTask.delete({
        where: {
            id: task.id
        }
    })
    await prisma.lectureAuditLog.create({
        data: {
            type: LectureAuditLogType.confirmedLocation,
            userId: user.id,
            lectureId: lecture.id,
            values: [location]
        }
    })
    await prisma.notification.create({
        data: {
            lectureId: lecture.id,
            userId: lecture.userId,
            type: LectureAuditLogType.confirmedLocation,
            values: [ user.id, location ]
        }
    })
    await prisma.lectureTask.create({
        data: {
            type: LectureTasks.testDevice,
            assigneeId: lecture.assigneeId!,
            lectureId: lecture.id,
            dueAt: daysBefore(lecture.date!, 1)
        }
    })
    return lecture
}

export async function testDevice(lectureId: number, task: HydratedLectureTask): Promise<HydratedLecture> {
    const user = await requireTaskUser(task)
    const lecture = (await prisma.lecture.findUnique({
        where: {
            id: lectureId
        },
        include: HydratedLectureInclude
    }))!
    await prisma.lectureTask.delete({
        where: {
            id: task.id
        }
    })
    await prisma.lectureAuditLog.create({
        data: {
            type: LectureAuditLogType.testedDevice,
            userId: user.id,
            lectureId: lecture.id
        }
    })
    return lecture
}

export async function markReady(lectureId: number): Promise<HydratedLecture> {
    const user = await requireUserPermission('admin.manage')
    const lecture = (await prisma.lecture.findUnique({
        where: {
            id: lectureId
        },
        include: HydratedLectureInclude
    }))!
    await prisma.lecture.update({
        where: {
            id: lecture.id
        },
        data: {
            status: LectureStatus.ready
        }
    })
    await prisma.lectureAuditLog.create({
        data: {
            type: LectureAuditLogType.modifiedStatus,
            userId: user.id,
            lectureId: lecture.id,
            values: ['ready']
        }
    })
    await prisma.notification.create({
        data: {
            lectureId: lecture.id,
            userId: lecture.userId,
            type: LectureAuditLogType.modifiedStatus,
            values: [ user.id, 'ready' ]
        }
    })
    return lecture
}

export async function markCompletingPostTasks(lectureId: number): Promise<HydratedLecture> {
    const user = await requireUserPermission('admin.manage')
    const lecture = (await prisma.lecture.findUnique({
        where: {
            id: lectureId
        },
        include: HydratedLectureInclude
    }))!
    await prisma.lecture.update({
        where: {
            id: lecture.id
        },
        data: {
            status: LectureStatus.completingPostTasks
        }
    })
    await prisma.lectureAuditLog.create({
        data: {
            type: LectureAuditLogType.modifiedStatus,
            userId: user.id,
            lectureId: lecture.id,
            values: ['completingPostTasks']
        }
    })
    await prisma.notification.create({
        data: {
            lectureId: lecture.id,
            userId: lecture.userId,
            type: LectureAuditLogType.modifiedStatus,
            values: [ user.id, 'completingPostTasks' ]
        }
    })
    await prisma.lectureTask.create({
        data: {
            type: LectureTasks.updateLiveAudience,
            assigneeId: lecture.assigneeId!,
            lectureId: lecture.id,
            dueAt: daysBefore(lecture.date!, -1)
        }
    })
    await prisma.lectureTask.create({
        data: {
            type: LectureTasks.submitFeedback,
            assigneeId: lecture.assigneeId!,
            lectureId: lecture.id,
            dueAt: daysBefore(lecture.date!, -1)
        }
    })
    await prisma.lectureTask.create({
        data: {
            type: LectureTasks.submitVideo,
            assigneeId: lecture.assigneeId!,
            lectureId: lecture.id,
            dueAt: daysBefore(lecture.date!, -1)
        }
    })
    await prisma.lectureTask.create({
        data: {
            type: LectureTasks.submitReflection,
            assigneeId: lecture.assigneeId!,
            lectureId: lecture.id,
            dueAt: daysBefore(lecture.date!, -7)
        }
    })
    return lecture
}

export async function updateLiveAudience(lectureId: number, task: HydratedLectureTask, liveAudience: number): Promise<HydratedLecture> {
    const user = await requireTaskUser(task)
    const lecture = (await prisma.lecture.findUnique({
        where: {
            id: lectureId
        },
        include: HydratedLectureInclude
    }))!
    await prisma.lecture.update({
        where: {
            id: lecture.id
        },
        data: {
            liveAudience
        }
    })
    await prisma.lectureTask.delete({
        where: {
            id: task.id
        }
    })
    await prisma.lectureAuditLog.create({
        data: {
            type: LectureAuditLogType.updatedLiveAudience,
            userId: user.id,
            lectureId: lecture.id,
            values: [liveAudience.toString()]
        }
    })
    await prisma.notification.create({
        data: {
            lectureId: lecture.id,
            userId: lecture.userId,
            type: LectureAuditLogType.updatedLiveAudience,
            values: [ user.id, liveAudience.toString() ]
        }
    })
    return lecture
}

export async function submitVideo(lectureId: number, task: HydratedLectureTask, video: string): Promise<HydratedLecture> {
    const user = await requireTaskUser(task)
    const lecture = (await prisma.lecture.findUnique({
        where: {
            id: lectureId
        },
        include: HydratedLectureInclude
    }))!
    await prisma.lecture.update({
        where: {
            id: lecture.id
        },
        data: {
            uploadedVideo: video
        }
    })
    await prisma.lectureTask.delete({
        where: {
            id: task.id
        }
    })
    await prisma.lectureAuditLog.create({
        data: {
            type: LectureAuditLogType.submittedVideo,
            userId: user.id,
            lectureId: lecture.id,
            values: [video]
        }
    })
    await prisma.notification.create({
        data: {
            lectureId: lecture.id,
            userId: lecture.userId,
            type: LectureAuditLogType.submittedVideo,
            values: [ user.id ]
        }
    })
    return lecture
}

export async function submitReflection(lectureId: number, task: HydratedLectureTask, reflection: string): Promise<HydratedLecture> {
    const user = await requireTaskUser(task)
    const lecture = (await prisma.lecture.findUnique({
        where: {
            id: lectureId
        },
        include: HydratedLectureInclude
    }))!
    await prisma.lecture.update({
        where: {
            id: lecture.id
        },
        data: {
            teacherPreFdbk: reflection
        }
    })
    await prisma.lectureTask.delete({
        where: {
            id: task.id
        }
    })
    await prisma.lectureAuditLog.create({
        data: {
            type: LectureAuditLogType.submittedReflection,
            userId: user.id,
            lectureId: lecture.id,
            values: [reflection]
        }
    })
    await prisma.notification.create({
        data: {
            lectureId: lecture.id,
            userId: lecture.userId,
            type: LectureAuditLogType.submittedReflection,
            values: [ user.id ]
        }
    })
    return lecture
}

export async function markCompleted(lectureId: number): Promise<HydratedLecture> {
    const user = await requireUserPermission('admin.manage')
    const lecture = (await prisma.lecture.findUnique({
        where: {
            id: lectureId
        },
        include: HydratedLectureInclude
    }))!
    await prisma.lecture.update({
        where: {
            id: lecture.id
        },
        data: {
            status: LectureStatus.completed
        }
    })
    await prisma.lectureAuditLog.create({
        data: {
            type: LectureAuditLogType.modifiedStatus,
            userId: user.id,
            lectureId: lecture.id,
            values: ['completed']
        }
    })
    await prisma.notification.create({
        data: {
            lectureId: lecture.id,
            userId: lecture.userId,
            type: LectureAuditLogType.modifiedStatus,
            values: [ user.id, 'completed' ]
        }
    })
    return lecture
}

export async function getLogs(lectureId: number, page: number): Promise<Paginated<HydratedLectureAuditLog>> {
    const lecture = (await prisma.lecture.findUnique({
        where: {
            id: lectureId
        }
    }))!
    const pages = Math.ceil(await prisma.lectureAuditLog.count({
        where: {
            lectureId: lecture.id
        }
    }) / 10)
    const logs = await prisma.lectureAuditLog.findMany({
        where: {
            lectureId: lecture.id
        },
        orderBy: {
            time: 'desc'
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    phone: true
                }
            }
        },
        skip: page * 10,
        take: 10
    })
    return {
        items: logs,
        page,
        pages
    }
}

export async function changeLocation(lectureId: number, location: string): Promise<HydratedLecture> {
    const user = await requireUserPermission('admin.manage')
    const lecture = (await prisma.lecture.findUnique({
        where: {
            id: lectureId
        },
        include: HydratedLectureInclude
    }))!
    await prisma.lecture.update({
        where: {
            id: lecture.id
        },
        data: {
            location
        }
    })
    await prisma.lectureAuditLog.create({
        data: {
            type: LectureAuditLogType.confirmedLocation,
            userId: user.id,
            lectureId: lecture.id,
            values: [ location ]
        }
    })
    await prisma.notification.create({
        data: {
            lectureId: lecture.id,
            userId: lecture.userId,
            type: LectureAuditLogType.confirmedLocation,
            values: [ user.id, location ]
        }
    })
    return lecture
}

export async function changeDate(lectureId: number, date: Date): Promise<HydratedLecture> {
    const user = await requireUserPermission('admin.manage')
    const lecture = (await prisma.lecture.findUnique({
        where: {
            id: lectureId
        },
        include: HydratedLectureInclude
    }))!
    const currentDate = lecture.date
    const deltaDays = Math.floor((date.getTime() - currentDate!.getTime()) / (24 * 60 * 60 * 1000))
    for (const task of lecture.tasks) {
        await prisma.lectureTask.update({
            where: {
                id: task.id
            },
            data: {
                dueAt: new Date(task.dueAt.getTime() + deltaDays * 24 * 60 * 60 * 1000)
            }
        })
    }
    await prisma.lecture.update({
        where: {
            id: lectureId
        },
        data: {
            date
        }
    })
    await prisma.lectureAuditLog.create({
        data: {
            type: LectureAuditLogType.confirmedDate,
            userId: user.id,
            lectureId: lecture.id,
            values: [ date.getTime().toString() ]
        }
    })
    await prisma.notification.create({
        data: {
            lectureId: lecture.id,
            userId: lecture.userId,
            type: LectureAuditLogType.confirmedDate,
            values: [ user.id, date.getTime().toString() ]
        }
    })
    return lecture
}

export async function markReclaimable(lectureId: number): Promise<void> {
    const user = await requireUserPermission('admin.manage')
    const lecture = await prisma.lecture.findUniqueOrThrow({
        where: {
            id: lectureId
        }
    })
    await prisma.lecture.update({
        where: {
            id: lecture.id
        },
        data: {
            reclaimable: true
        }
    })
    await prisma.lectureAuditLog.create({
        data: {
            type: LectureAuditLogType.markedReclaimable,
            userId: user.id,
            lectureId: lecture.id
        }
    })
}

export async function removeTeacher(lectureId: number): Promise<void> {
    const user = await requireUserPermission('admin.manage')
    const lecture = await prisma.lecture.findUniqueOrThrow({
        where: {
            id: lectureId
        }
    })
    await prisma.lecture.update({
        where: {
            id: lecture.id
        },
        data: {
            assigneeTeacherId: null
        }
    })
    await prisma.lectureTask.deleteMany({
        where: {
            lectureId,
            type: LectureTasks.teacherApprovePresentation
        }
    })
    await prisma.lectureTask.create({
        data: {
            type: LectureTasks.inviteTeacher,
            assigneeId: lecture.assigneeId!,
            lectureId: lecture.id,
            dueAt: daysBefore(lecture.date!, 5)
        }
    })
    await prisma.lectureAuditLog.create({
        data: {
            type: LectureAuditLogType.removedTeacher,
            userId: user.id,
            lectureId: lecture.id
        }
    })
}

export async function removeArtist(lectureId: number): Promise<void> {
    const user = await requireUserPermission('admin.manage')
    const lecture = await prisma.lecture.findUniqueOrThrow({
        where: {
            id: lectureId
        }
    })
    await prisma.lecture.update({
        where: {
            id: lecture.id
        },
        data: {
            posterAssigneeId: null,
            needComPoster: null
        }
    })
    await prisma.lectureTask.deleteMany({
        where: {
            lectureId,
            type: LectureTasks.submitPoster
        }
    })
    await prisma.lectureTask.deleteMany({
        where: {
            lectureId,
            type: LectureTasks.schoolApprovePoster
        }
    })
    await prisma.lectureTask.create({
        data: {
            type: LectureTasks.confirmNeedComPoster,
            assigneeId: user.id,
            lectureId: lecture.id,
            dueAt: daysBefore(lecture.date!, 5)
        }
    })
    await prisma.lectureAuditLog.create({
        data: {
            type: LectureAuditLogType.removedArtist,
            userId: user.id,
            lectureId: lecture.id
        }
    })
}

export async function deleteLecture(lectureId: number): Promise<void> {
    const user = await requireUser()
    const lecture = await prisma.lecture.findUniqueOrThrow({
        where: {
            id: lectureId
        }
    })
    if (!user.permissions.includes('admin.manage') && lecture.assigneeId !== user.id) {
        throw new Error('Unauthorized')
    }
    await prisma.lecture.delete({
        where: {
            id: lectureId
        }
    })
}
