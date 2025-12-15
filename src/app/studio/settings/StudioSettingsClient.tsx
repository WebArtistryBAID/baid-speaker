'use client'

import { NotificationType, User } from '@/generated/prisma/browser'
import { useTranslationClient } from '@/app/i18n/client'
import { Breadcrumb, BreadcrumbItem, Button, Checkbox } from 'flowbite-react'
import { HiColorSwatch, HiUser } from 'react-icons/hi'
import If from '@/app/lib/If'
import { toggleInboxNotification, toggleSMSNotification } from '@/app/login/login-actions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useCookies } from 'react-cookie'

export default function StudioSettingsClient({ user }: { user: User }) {
    const { t } = useTranslationClient('studio')
    const router = useRouter()
    const [ loading, setLoading ] = useState(false)
    const removeCookie = useCookies()[2]

    return <div className="base-studio-page">
        <Breadcrumb aria-label={t('breadcrumb.bc')} className="mb-3">
            <BreadcrumbItem href="/studio" icon={HiColorSwatch}>{t('breadcrumb.studio')}</BreadcrumbItem>
            <BreadcrumbItem>{t('breadcrumb.settings')}</BreadcrumbItem>
        </Breadcrumb>
        <h1 className="mb-5">{t('settings.title')}</h1>
        <div className="flex w-full items-center gap-4 mb-5">
            <div className="bg-blue-500 rounded-full h-16 w-16 flex justify-center items-center">
                <HiUser className="text-white text-3xl"/>
            </div>
            <div className="font-display">
                <h2>{user.name}</h2>
                <p>{user.pinyin}</p>
            </div>
        </div>

        <div className="2xl:w-1/2">
            <div className="mb-8">
                <h2 className="text-sm font-normal mb-3">{t('settings.profile.title')}</h2>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-5">
                    <p className="secondary text-sm font-display">{t('settings.profile.name')}</p>
                    <p className="text-xl mb-3">{user.name}</p>

                    <p className="secondary text-sm font-display">{t('settings.profile.pinyin')}</p>
                    <p className="text-xl mb-3">{user.pinyin}</p>

                    <If condition={user.phone != null}>
                        <p className="secondary text-sm font-display">{t('settings.profile.phone')}</p>
                        <p className="text-xl mb-3">{user.phone}</p>
                    </If>

                    <p className="text-sm secondary">{t('settings.profile.updateInfo')}</p>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-sm font-normal mb-3">{t('settings.notifications.title')}</h2>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-5">
                    <table className="w-full mb-5">
                        <thead>
                        <tr>
                            <th className="sr-only">{t('settings.notifications.type')}</th>
                            <th className="font-normal font-display">{t('settings.notifications.inbox')}</th>
                            <th className="font-normal font-display">{t('settings.notifications.sms')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Object.values(NotificationType).map((type) => (
                            <tr key={type} className="border-b-transparent border-b-8">
                                <th className="text-left font-normal w-1/2">{t(`settings.notifications.types.${type}`)}</th>
                                <td className="w-1/4">
                                    <div className="w-full flex justify-center">
                                        <Checkbox
                                            aria-label={`${t(`settings.notifications.types.${type}`)}: ${t('settings.notifications.inbox')}`}
                                            checked={user.inboxNotifications.includes(type)}
                                            onChange={async () => {
                                                await toggleInboxNotification(type)
                                                router.refresh()
                                            }}/>
                                    </div>
                                </td>
                                <td className="w-1/4">
                                    <div className="w-full flex justify-center">
                                        <Checkbox
                                            aria-label={`${t(`settings.notifications.types.${type}`)}: ${t('settings.notifications.sms')}`}
                                            checked={user.smsNotifications.includes(type)}
                                            onChange={async () => {
                                                if (loading) {
                                                    return
                                                }
                                                setLoading(true)
                                                await toggleSMSNotification(type)
                                                router.refresh()
                                                setLoading(false)
                                            }}/>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <p className="text-sm secondary">{t('settings.notifications.smsInfo')}</p>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-sm font-normal mb-3">{t('settings.others.title')}</h2>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-5">
                    <Button color="blue" className="mb-3" onClick={() => {
                        removeCookie('access_token', { path: '/' })
                        location.reload() // Special case reload: full reload to clear all state, NOT router reload
                    }}>{t('settings.others.logOut')}</Button>
                    <p className="text-sm secondary">{t('settings.others.credits')}</p>
                </div>
            </div>
        </div>
    </div>
}
