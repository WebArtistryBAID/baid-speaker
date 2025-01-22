import StudioInboxClient from '@/app/studio/inbox/StudioInboxClient'
import { getMyNotifications } from '@/app/login/login-actions'

export default async function StudioInbox() {
    return <StudioInboxClient notifications={await getMyNotifications(0)}/>
}
