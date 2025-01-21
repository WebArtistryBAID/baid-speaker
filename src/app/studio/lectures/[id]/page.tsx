import { getLecture } from '@/app/lib/lecture-actions'
import StudioLecture from '@/app/studio/lectures/[id]/StudioLecture'

export default async function StudioLectureBase({ params }: { params: Promise<{ id: string }> }) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const id = (await params).id
    const lecture = await getLecture(parseInt(id as string))
    if (lecture == null) {
        return <div>Error</div>
    }
    return <StudioLecture lecture={lecture} uploadServePath={`/${process.env.UPLOAD_SERVE_PATH}/`}/>
}
