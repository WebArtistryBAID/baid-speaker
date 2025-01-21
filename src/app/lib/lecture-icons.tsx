import { Lecture, LectureStatus, User } from '@prisma/client'
import {
    HiAcademicCap,
    HiAnnotation,
    HiBriefcase,
    HiCheckCircle,
    HiGift,
    HiPhotograph,
    HiSpeakerphone,
    HiVideoCamera
} from 'react-icons/hi'

export default function LectureStatusIcon({ status }: { status: LectureStatus }) {
    if (status === LectureStatus.waiting) {
        return <HiAnnotation className="text-7xl text-blue-500"/>
    }
    if (status === LectureStatus.completingPreTasks) {
        return <HiBriefcase className="text-7xl text-blue-500"/>
    }
    if (status === LectureStatus.ready) {
        return <HiCheckCircle className="text-7xl text-green-400"/>
    }
    if (status === LectureStatus.completingPostTasks) {
        return <HiVideoCamera className="text-7xl text-blue-500"/>
    }
    if (status === LectureStatus.completed) {
        return <HiGift className="text-7xl text-yellow-300"/>
    }
}

export function LectureStatusIconCircle({ status }: { status: LectureStatus }) {
    if (status === LectureStatus.waiting) {
        return <div className="rounded-full flex justify-center items-center bg-blue-500 w-8 h-8"><HiAnnotation
            className="text-white"/></div>
    }
    if (status === LectureStatus.completingPreTasks) {
        return <div className="rounded-full flex justify-center items-center bg-blue-500 w-8 h-8"><HiBriefcase
            className="text-white"/></div>
    }
    if (status === LectureStatus.ready) {
        return <div className="rounded-full flex justify-center items-center bg-green-400 w-8 h-8"><HiCheckCircle
            className="text-white"/></div>
    }
    if (status === LectureStatus.completingPostTasks) {
        return <div className="rounded-full flex justify-center items-center bg-blue-500 w-8 h-8"><HiVideoCamera
            className="text-white"/></div>
    }
    if (status === LectureStatus.completed) {
        return <div className="rounded-full flex justify-center items-center bg-yellow-300 w-8 h-8"><HiGift
            className="text-white"/></div>
    }
    return <></>
}

export function LectureRoleIconCircle({ lecture, user }: { lecture: Lecture, user: User }) {
    if (lecture.assigneeId === user.id) {
        return <div className="rounded-full flex justify-center items-center bg-blue-500 w-8 h-8"><HiBriefcase
            className="text-white"/></div>
    }
    if (lecture.userId === user.id) {
        return <div className="rounded-full flex justify-center items-center bg-green-400 w-8 h-8"><HiSpeakerphone
            className="text-white"/></div>
    }
    if (lecture.assigneeTeacherId === user.id) {
        return <div className="rounded-full flex justify-center items-center bg-yellow-300 w-8 h-8"><HiAcademicCap
            className="text-white"/></div>
    }
    if (lecture.posterAssigneeId === user.id) {
        return <div className="rounded-full flex justify-center items-center bg-pink-500 w-8 h-8"><HiPhotograph
            className="text-white"/></div>
    }
    return <></>
}
