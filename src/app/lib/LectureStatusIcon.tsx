import { LectureStatus } from '@prisma/client'
import { HiAnnotation, HiBriefcase, HiCheckCircle, HiGift, HiVideoCamera } from 'react-icons/hi'

export default function LectureStatusIcon({ status }: { status: LectureStatus }) {
    if (status === LectureStatus.waiting) {
        return <HiAnnotation className="text-7xl text-blue-500"/>
    }
    if (status === LectureStatus.completingPreTasks) {
        return <HiBriefcase className="text-7xl text-purple-500"/>
    }
    if (status === LectureStatus.ready) {
        return <HiCheckCircle className="text-7xl text-green-400"/>
    }
    if (status === LectureStatus.completingPostTasks) {
        return <HiVideoCamera className="text-7xl text-purple-500"/>
    }
    if (status === LectureStatus.completed) {
        return <HiGift className="text-7xl text-yellow-300"/>
    }
}
