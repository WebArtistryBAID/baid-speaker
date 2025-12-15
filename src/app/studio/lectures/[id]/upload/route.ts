import { NextRequest, NextResponse } from 'next/server'
import { getLecture } from '@/app/lib/lecture-actions'
import { requireUser } from '@/app/login/login-actions'
import * as fs from 'fs/promises'
import path from 'node:path'
import { createWriteStream } from 'node:fs'
import { LectureAuditLogType, NotificationType } from '@/generated/prisma/client'
import { Readable } from 'node:stream'
import { sendNotification } from '@/app/lib/notify-action'
import { prisma } from '@/app/lib/prisma'

function getPath(relative: string): string {
    return path.join(process.env.UPLOAD_PATH!, relative)
}

export async function POST(req: NextRequest, { params }: {
    params: Promise<{ id: string }>
}): Promise<Response> {
    try {
        await fs.access(process.env.UPLOAD_PATH!)
    } catch {
        await fs.mkdir(process.env.UPLOAD_PATH!, { recursive: true })
    }

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
    if (target === 'poster') {
        if (lecture.uploadedPoster != null) {
            await fs.unlink(getPath(lecture.uploadedPoster))
        }
        const filename = `${id}-poster-${Date.now()}.${file.name.split('.').pop()}`
        const stream = createWriteStream(getPath(filename))
        await new Promise((resolve, reject) => {
            Readable.fromWeb(file.stream() as never).pipe(stream)
            stream.on('finish', resolve)
            stream.on('error', reject)
        })

        await prisma.lecture.update({
            where: {
                id: lecture.id
            },
            data: {
                uploadedPoster: filename
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
        if (lecture.userId !== user.id) {
            await sendNotification(lecture.user, NotificationType.submittedPoster, [ user.name ], lecture.id)
        }
        return NextResponse.json({ success: true })
    } else if (target === 'slides' && (lecture.userId === user.id || user.permissions.includes('admin.manage'))) {
        if (lecture.uploadedSlides != null) {
            await fs.unlink(getPath(lecture.uploadedSlides))
        }
        const filename = `${id}-slides-${Date.now()}.${file.name.split('.').pop()}`
        const stream = createWriteStream(getPath(filename))
        await new Promise((resolve, reject) => {
            Readable.fromWeb(file.stream() as never).pipe(stream)
            stream.on('finish', resolve)
            stream.on('error', reject)
        })

        await prisma.lecture.update({
            where: {
                id: lecture.id
            },
            data: {
                uploadedSlides: filename
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

        return NextResponse.json({ success: true })
    } else if (target === 'groupQR' && (lecture.assigneeId === user.id || user.permissions.includes('admin.manage'))) {
        if (lecture.uploadedGroupQR != null) {
            await fs.unlink(getPath(lecture.uploadedGroupQR))
        }
        const filename = `${id}-groupQR-${Date.now()}.${file.name.split('.').pop()}`
        const stream = createWriteStream(getPath(filename))
        await new Promise((resolve, reject) => {
            Readable.fromWeb(file.stream() as never).pipe(stream)
            stream.on('finish', resolve)
            stream.on('error', reject)
        })

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

        return NextResponse.json({ success: true })
    } else if (target === 'feedback' && (lecture.assigneeId === user.id || user.permissions.includes('admin.manage'))) {
        if (lecture.uploadedFeedback != null) {
            await fs.unlink(getPath(lecture.uploadedFeedback))
        }
        const filename = `${id}-feedback-${Date.now()}.${file.name.split('.').pop()}`
        const stream = createWriteStream(getPath(filename))
        await new Promise((resolve, reject) => {
            Readable.fromWeb(file.stream() as never).pipe(stream)
            stream.on('finish', resolve)
            stream.on('error', reject)
        })

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
        return NextResponse.json({ success: true })
    }
    return NextResponse.error()
}
