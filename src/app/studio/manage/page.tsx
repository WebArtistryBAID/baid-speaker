import { getMyUser } from '@/app/login/login-actions'
import { serverTranslation } from '@/app/i18n'

export default async function StudioManage() {
    const { t } = await serverTranslation('studio')
    const myUser = (await getMyUser())!
    if (!myUser.permissions.includes('admin.manage')) {
        return <div>Unauthorized</div>
    }
    return <div className="base-studio-page">
        <h1 className="mb-5">{t('manage.title')}</h1>
    </div>
}
