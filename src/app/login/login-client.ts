import { getLoginTarget } from '@/app/login/login-actions'

export async function requireLoginClient(cookies: any): Promise<void> {
    if (!('access_token' in cookies)) {
        location.href = await getLoginTarget()
        throw Error('pause')
    }
}
