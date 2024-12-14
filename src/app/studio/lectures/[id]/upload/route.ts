import { NextRequest, NextResponse } from 'next/server'
import { getLecture } from '@/app/lib/lecture-actions'
import { requireUser } from '@/app/login/login-actions'
import * as fs from 'fs/promises'
import path from 'node:path'
import { createWriteStream } from 'node:fs'
import { LectureAuditLogType, LectureTasks, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function getPath(relative: string): string {
    return path.join(process.env.UPLOAD_PATH!, relative)
}

function daysBefore(d: Date, days: number): Date {
    return new Date(d.getTime() - days * 24 * 60 * 60 * 1000)
}

export default async function POST(req: NextRequest, { params }: {
    params: Promise<{ id: string }>
}): Promise<Response> {
    const id = (await params).id
    const lecture = await getLecture(parseInt(id as string))
    if (lecture == null) {
        return NextResponse.error()
    }
    const user = await requireUser()

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (file == null) {
        return NextResponse.error()
    }
    const target: string = formData.get('target') as string
    if (target == null) {
        return NextResponse.error()
    }
    // Validate if this target is acceptable
    if (target === 'poster' && lecture.posterAssigneeId === user.id) {
        const task = await prisma.lectureTask.findFirst({
            where: {
                lectureId: lecture.id,
                type: LectureTasks.submitPoster
            }
        })

        if (lecture.uploadedPoster != null) {
            await fs.unlink(getPath(lecture.uploadedPoster))
        }
        const filename = `${id}-poster-${Date.now()}`
        const stream = createWriteStream(getPath(filename));
        (file.stream() as unknown as NodeJS.ReadableStream).pipe(stream)

        await prisma.lecture.update({
            where: {
                id: lecture.id
            },
            data: {
                uploadedPoster: filename,
                posterApproved: false
            }
        })
        await prisma.lectureAuditLog.create({
            data: {
                lectureId: lecture.id,
                userId: user.id,
                type: LectureAuditLogType.submittedPoster,
                values: [ filename ]
            }
        })
        if (task != null) {
            await prisma.lectureTask.delete({
                where: {
                    id: task.id
                }
            })
        }
        if (await prisma.lectureTask.count({
            where: {
                type: LectureTasks.schoolApprovePoster,
                lectureId: lecture.id
            }
        }) === 0) {
            await prisma.lectureTask.create({
                data: {
                    type: LectureTasks.schoolApprovePoster,
                    assigneeId: lecture.assigneeId!,
                    lectureId: lecture.id,
                    dueAt: daysBefore(lecture.date!, 1)
                }
            })
        }

        return NextResponse.json({ success: true })
    } else if (target === 'slides' && lecture.userId === user.id) {
        const task = await prisma.lectureTask.findFirst({
            where: {
                lectureId: lecture.id,
                type: LectureTasks.submitPresentation
            }
        })

        let isFirstSubmit = true
        if (lecture.uploadedSlides != null) {
            isFirstSubmit = false
            await fs.unlink(getPath(lecture.uploadedSlides))
        }
        const filename = `${id}-slides-${Date.now()}`
        const stream = createWriteStream(getPath(filename));
        (file.stream() as unknown as NodeJS.ReadableStream).pipe(stream)

        await prisma.lecture.update({
            where: {
                id: lecture.id
            },
            data: {
                uploadedSlides: filename,
                slidesApproved: false
            }
        })
        await prisma.lectureAuditLog.create({
            data: {
                lectureId: lecture.id,
                userId: user.id,
                type: LectureAuditLogType.submittedPresentation,
                values: [ filename ]
            }
        })
        if (task != null) {
            await prisma.lectureTask.delete({
                where: {
                    id: task.id
                }
            })
        }
        if (lecture.assigneeTeacherId != null && await prisma.lectureTask.count({
            where: {
                type: LectureTasks.teacherApprovePresentation,
                lectureId: lecture.id
            }
        }) === 0) {
            await prisma.lectureTask.create({
                data: {
                    type: LectureTasks.teacherApprovePresentation,
                    assigneeId: lecture.assigneeTeacherId!,
                    lectureId: lecture.id,
                    dueAt: daysBefore(lecture.date!, 1)
                }
            })
        }
        if (lecture.posterApproved === true && isFirstSubmit) {
            await prisma.lectureTask.create({
                data: {
                    type: LectureTasks.sendAdvertisements,
                    assigneeId: lecture.assigneeId!,
                    lectureId: lecture.id,
                    dueAt: daysBefore(lecture.date!, 1)
                }
            })
        }

        if (isFirstSubmit) {
            await prisma.lectureTask.create({
                data: {
                    type: LectureTasks.createGroupChat,
                    assigneeId: lecture.assigneeId!,
                    lectureId: lecture.id,
                    dueAt: daysBefore(lecture.date!, 1)
                }
            })
            await prisma.lectureTask.create({
                data: {
                    type: LectureTasks.inviteParticipants,
                    assigneeId: lecture.userId,
                    lectureId: lecture.id,
                    dueAt: daysBefore(lecture.date!, 1)
                }
            })
        }

        return NextResponse.json({ success: true })
    } else if (target === 'groupQR' && lecture.assigneeId === user.id) {
        const task = await prisma.lectureTask.findFirst({
            where: {
                lectureId: lecture.id,
                type: LectureTasks.createGroupChat
            }
        })

        if (lecture.uploadedGroupQR != null) {
            await fs.unlink(getPath(lecture.uploadedGroupQR))
        }
        const filename = `${id}-groupQR-${Date.now()}`
        const stream = createWriteStream(getPath(filename));
        (file.stream() as unknown as NodeJS.ReadableStream).pipe(stream)

        await prisma.lecture.update({
            where: {
                id: lecture.id
            },
            data: {
                uploadedGroupQR: filename
            }
        })
        await prisma.lectureAuditLog.create({
            data: {
                lectureId: lecture.id,
                userId: user.id,
                type: LectureAuditLogType.createdGroupChat,
                values: [ filename ]
            }
        })

        if (task != null) {
            await prisma.lectureTask.delete({
                where: {
                    id: task.id
                }
            })
        }

        return NextResponse.json({ success: true })
    } else if (target === 'feedback' && lecture.assigneeId === user.id) {
        const task = await prisma.lectureTask.findFirst({
            where: {
                lectureId: lecture.id,
                type: LectureTasks.submitFeedback
            }
        })

        if (lecture.uploadedFeedback != null) {
            await fs.unlink(getPath(lecture.uploadedFeedback))
        }
        const filename = `${id}-feedback-${Date.now()}`
        const stream = createWriteStream(getPath(filename));
        (file.stream() as unknown as NodeJS.ReadableStream).pipe(stream)

        await prisma.lecture.update({
            where: {
                id: lecture.id
            },
            data: {
                uploadedFeedback: filename
            }
        })
        await prisma.lectureAuditLog.create({
            data: {
                lectureId: lecture.id,
                userId: user.id,
                type: LectureAuditLogType.submittedFeedback,
                values: [ filename ]
            }
        })
        if (task != null) {
            await prisma.lectureTask.delete({
                where: {
                    id: task.id
                }
            })
        }

        return NextResponse.json({ success: true })
    }
    return NextResponse.error()
}
