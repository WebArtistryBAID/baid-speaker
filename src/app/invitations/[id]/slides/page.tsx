import { getLecture } from '@/app/lib/lecture-actions'
import StudioSlidesApproval from '@/app/invitations/[id]/slides/StudioSlidesApproval'

export default async function StudioSlidesApprovalBase({params}: { params: Promise<{ id: string }> }) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const id = (await params).id
    const lecture = await getLecture(parseInt(id as string))
    if (lecture == null) {
        return <div>Error</div>
    }
    if (lecture.slidesApproved === true || lecture.uploadedSlides == null) {
        return <div>Error</div>
    }
    return <StudioSlidesApproval lecture={lecture} uploadServePath={process.env.UPLOAD_SERVE_PATH!}/>
}
