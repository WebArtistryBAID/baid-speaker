import { getUser } from '@/app/login/login-actions'
import StudioUserClient from '@/app/studio/users/[id]/StudioUserClient'

export default async function StudioUserBase({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id
    const user = await getUser(parseInt(id))
    if (user == null) {
        return <div>Error</div>
    }
    return <StudioUserClient user={user}/>
}
