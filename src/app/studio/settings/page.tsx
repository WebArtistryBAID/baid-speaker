import { getMyUser } from '@/app/login/login-actions'
import StudioSettingsClient from '@/app/studio/settings/StudioSettingsClient'

export default async function StudioSettings() {
    const user = await getMyUser()
    if (user == null) {
        return <div>Unauthorized</div>
    }
    return <StudioSettingsClient user={user}/>
}
