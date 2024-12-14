import { getLecture } from '@/app/lib/lecture-actions'
import StudioArtist from '@/app/studio/lectures/[id]/artist/StudioArtist'

export default async function StudioArtistBase({ params }: { params: Promise<{ id: string }> }) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const id = (await params).id
    const lecture = await getLecture(parseInt(id as string))
    if (lecture == null) {
        return <div>Error</div>
    }
    if (lecture.posterAssigneeId != null) {
        return <div>Error</div>
    }
    return <StudioArtist lecture={lecture}/>
}
