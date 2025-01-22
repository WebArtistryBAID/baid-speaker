import { getLecture } from '@/app/lib/lecture-actions'
import StudioTeacher from '@/app/invitations/[id]/teacher/StudioTeacher'

export default async function StudioTeacherBase({ params }: { params: Promise<{ id: string }> }) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const id = (await params).id
    const lecture = await getLecture(parseInt(id as string))
    if (lecture == null) {
        return <div>Error</div>
    }
    if (lecture.assigneeTeacherId != null) {
        return <div>Error</div>
    }
    return <StudioTeacher lecture={lecture}/>
}
