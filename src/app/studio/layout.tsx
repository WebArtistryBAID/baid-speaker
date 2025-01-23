'use client'

import { ReactNode, useEffect, useState } from 'react'
import {
    Badge,
    Sidebar,
    SidebarCollapse,
    SidebarCTA,
    SidebarItem,
    SidebarItemGroup,
    SidebarItems,
    SidebarLogo
} from 'flowbite-react'
import { HiAcademicCap, HiChartPie, HiCog, HiCollection, HiInbox, HiUser, HiUsers } from 'react-icons/hi'
import Link from 'next/link'
import { useTranslationClient } from '@/app/i18n/client'
import If from '@/app/lib/If'
import { User } from '@prisma/client'
import { getMyNotificationsCount, getMyUser } from '@/app/login/login-actions'

export default function StudioLayout({ children }: { children: ReactNode }) {
    const { t } = useTranslationClient('studio')
    const [ myUser, setMyUser ] = useState<User>()
    const [ notifications, setNotifications ] = useState(0)
    useEffect(() => {
        (async () => {
            setMyUser((await getMyUser())!)
        })()

        setInterval(async () => {
            setNotifications(await getMyNotificationsCount())
        }, 10000)
    }, [])

    return <>
        <div
            className="sm:hidden absolute w-screen h-screen z-50 top-0 left-0 bg-white dark:bg-gray-700 p-5 flex justify-center items-center flex-col">
            <div className="mb-3">
                <img src="/assets/illustrations/mobile-light.png" className="dark:hidden w-72" alt=""/>
                <img src="/assets/illustrations/mobile-dark.png" className="hidden dark:block w-72" alt=""/>
            </div>
            <p className="text-center">{t('mobile.message')}</p>
        </div>

        <div className="h-screen flex">
            <div className="h-screen">
                <Sidebar className="h-full relative">
                    <SidebarLogo href="/" img="/assets/logo.png"><span
                        className="font-display">BAID Speaker</span></SidebarLogo>
                    <SidebarItems>
                        <SidebarItemGroup>
                            <SidebarItem as={Link} href="/studio" icon={HiChartPie}>
                                {t('nav.dashboard')}
                            </SidebarItem>
                            <SidebarItem as={Link} href="/studio/lectures" icon={HiAcademicCap}>
                                {t('nav.lectures')}
                            </SidebarItem>
                            <SidebarItem as={Link} href="/studio/inbox" icon={HiInbox}
                                         label={notifications > 0 ? notifications.toString() : undefined}>
                                {t('nav.inbox')}
                            </SidebarItem>
                            <If condition={myUser?.permissions.includes('admin.manage')}>
                                <SidebarCollapse label="Management" icon={HiCog}>
                                    <SidebarItem as={Link} href="/studio/manage" icon={HiCollection}>
                                        {t('nav.manage')}
                                    </SidebarItem>
                                    <SidebarItem as={Link} href="/studio/users" icon={HiUsers}>
                                        {t('nav.user')}
                                    </SidebarItem>
                                </SidebarCollapse>
                            </If>
                        </SidebarItemGroup>
                    </SidebarItems>
                    <div className="mr-3 mb-3 absolute bottom-0">
                        <Link href="/studio/settings"
                              className="flex items-center gap-3 rounded-full p-3 bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-500 dark:bg-gray-600 transition-colors duration-100">
                            <Badge icon={HiUser}/>
                            <div>
                                <p className="font-bold font-display text-sm">{myUser?.name ?? '...'}</p>
                                <p className="secondary text-xs">{t('settings.title')}</p>
                            </div>
                        </Link>
                        <SidebarCTA>
                            <Badge color="warning" className="inline-block mb-3">{t('nav.beta')}</Badge>
                            <p className="secondary text-sm">
                                {t('nav.betaDetails')}
                            </p>
                        </SidebarCTA>
                    </div>
                </Sidebar>
            </div>
            <div className="flex-grow h-screen max-h-screen overflow-y-auto" style={{ overflowY: 'auto' }}>
                {children}
            </div>
        </div>
    </>
}