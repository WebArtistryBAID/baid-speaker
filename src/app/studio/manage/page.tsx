import { getMyUser } from '@/app/login/login-actions'
import StudioManage from '@/app/studio/manage/StudioManage'

export default async function StudioManageBase() {
    const myUser = (await getMyUser())!
    if (!myUser.permissions.includes('admin.manage')) {
        return <div>Unauthorized</div>
    }
    return <StudioManage/>
}
