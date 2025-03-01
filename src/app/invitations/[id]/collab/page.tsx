import { getLecture } from '@/app/lib/lecture-actions'
import StudioCollab from '@/app/invitations/[id]/collab/StudioCollab'

export default async function StudioCollabBase({ params }: { params: Promise<{ id: string }> }) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const id = (await params).id
    const lecture = await getLecture(parseInt(id as string))
    if (lecture == null) {
        return <div>Error</div>
    }
    if (lecture.posterAssigneeId != null) {
        return <div>Error</div>
    }
    return <StudioCollab lecture={lecture}/>
}
