import StudioUsersClient from '@/app/studio/users/StudioUsersClient'
import { getUsers } from '@/app/login/login-actions'

export default async function StudioUsers() {
    return <StudioUsersClient users={await getUsers(0, '')}/>
}
