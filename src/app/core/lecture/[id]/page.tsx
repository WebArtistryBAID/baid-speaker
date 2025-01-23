import { getLecture } from '@/app/lib/lecture-actions'
import CoreLectureClient from '@/app/core/lecture/[id]/CoreLectureClient'

export default async function CoreLectureBase({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id
    const lecture = await getLecture(parseInt(id as string))
    if (lecture == null) {
        return <div>Error</div>
    }
    return <CoreLectureClient lecture={lecture} uploadServePath={`/${process.env.UPLOAD_SERVE_PATH}/`}/>
}