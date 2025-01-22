import { getLecture } from '@/app/lib/lecture-actions'
import StudioPosterApproval from '@/app/invitations/[id]/poster/StudioPosterApproval'

export default async function StudioPosterApprovalBase({ params }: { params: Promise<{ id: string }> }) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const id = (await params).id
    const lecture = await getLecture(parseInt(id as string))
    if (lecture == null) {
        return <div>Error</div>
    }
    if (lecture.uploadedPoster == null || lecture.posterApproved === true) {
        return <div>Error</div>
    }
    return <StudioPosterApproval lecture={lecture} uploadServePath={process.env.UPLOAD_SERVE_PATH!}/>
}
