'use server'

import {Lecture, LectureAuditLogType, LectureStatus, LectureTasks, PrismaClient} from '@prisma/client'
import {requireUser, requireUserPermission} from '@/app/login/login-actions'

const prisma = new PrismaClient()

export interface HydratedLecture {
    id: number
    title: string
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
    assigneeId: number
    createdAt: Date
    updatedAt: Date
    dueAt: Date
    completedAt: Date | null
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

export async function getLecture(id: number): Promise<HydratedLecture | null> {
    const user = await requireUser()
    const lecture = await prisma.lecture.findUnique({
        where: {
            id
        },
        include: {
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
    })
    if (lecture?.userId !== user.id && lecture?.assigneeId !== user.id && lecture?.assigneeTeacherId !== user.id
        && lecture?.posterAssigneeId !== user.id && !user.permissions.includes('admin.manage')) {
        throw new Error('Unauthorized')
    }
    return lecture
}

export async function claimLecture(id: number): Promise<void> {
    const user = await requireUserPermission('admin.manage')
    const lecture = await prisma.lecture.findUnique({
        where: {
            id
        }
    })
    if (lecture?.status !== LectureStatus.waiting) {
        throw new Error('Cannot claim lecture')
    }
    await prisma.lecture.update({
        where: {
            id
        },
        data: {
            status: LectureStatus.completingPreTasks,
            assigneeId: user.id
        }
    })
    await prisma.lectureAuditLog.create({
        data: {
            type: LectureAuditLogType.assignedHost,
            userId: user.id,
            lectureId: lecture.id
        }
    })
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

export async function getUnassignedLectures(): Promise<HydratedLecture[]> {
    await requireUserPermission('admin.manage')
    return prisma.lecture.findMany({
        where: {
            status: LectureStatus.waiting
        },
        include: {
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
    })
}
