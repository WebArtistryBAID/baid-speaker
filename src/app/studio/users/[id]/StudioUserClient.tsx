'use client'

import { User } from '@/generated/prisma/browser'
import { Breadcrumb, BreadcrumbItem, ToggleSwitch } from 'flowbite-react'
import { HiColorSwatch } from 'react-icons/hi'
import { useTranslationClient } from '@/app/i18n/client'
import If from '@/app/lib/If'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getMyUser, toggleUserPermission } from '@/app/login/login-actions'

export default function StudioUserClient({ user }: { user: User }) {
    const { t } = useTranslationClient('studio')
    const [ myUser, setMyUser ] = useState<User>()
    const [ loading, setLoading ] = useState(false)
    const router = useRouter()

    useEffect(() => {
        (async () => {
            setMyUser((await getMyUser())!)
        })()
    }, [])

    return <div className="base-studio-page">
        <Breadcrumb aria-label={t('breadcrumb.bc')} className="mb-3">
            <BreadcrumbItem href="/studio" icon={HiColorSwatch}>{t('breadcrumb.studio')}</BreadcrumbItem>
            <BreadcrumbItem href="/studio/users">{t('breadcrumb.users')}</BreadcrumbItem>
            <BreadcrumbItem>{user.name}</BreadcrumbItem>
        </Breadcrumb>
        <h1 className="mb-5">{user.name}</h1>

        <div className="2xl:w-1/2">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-5">
                <p className="secondary text-sm font-display">{t('users.name')}</p>
                <p className="text-xl mb-3">{user.name}</p>

                <p className="secondary text-sm font-display">{t('users.pinyin')}</p>
                <p className="text-xl mb-3">{user.pinyin}</p>

                <p className="secondary text-sm font-display">{t('users.phone')}</p>
                <p className="text-xl mb-3">{user.phone ?? t('users.none')}</p>

                <p className="secondary text-sm font-display">{t('users.type')}</p>
                <p className="text-xl mb-3">{t(`users.${user.type}`)}</p>

                <p className="secondary text-sm font-display mb-1">{t('users.permissions')}</p>
                <ToggleSwitch className="mb-3" disabled={user.id === myUser?.id || loading}
                              checked={user.permissions.includes('admin.manage')} label={t('users.admin')}
                              onChange={async () => {
                                  setLoading(true)
                                  await toggleUserPermission(user.id, 'admin.manage')
                                  setLoading(false)
                                  router.refresh()
                              }}/>
                <If condition={user.id === myUser?.id}>
                    <p className="secondary text-sm">{t('users.permissionsOwn')}</p>
                </If>
            </div>
        </div>
    </div>
}
