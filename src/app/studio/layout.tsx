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
import { HiAcademicCap, HiChartPie, HiCog, HiUser, HiUsers } from 'react-icons/hi'
import Link from 'next/link'
import { useTranslationClient } from '@/app/i18n/client'
import If from '@/app/lib/If'
import { User } from '@/generated/prisma/browser'
import { getMyUser } from '@/app/login/login-actions'
import CookiesBoundary from '@/app/lib/CookiesBoundary'

export default function WrappedStudioLayout({ children }: { children: ReactNode }) {
    return <CookiesBoundary><StudioLayout>{children}</StudioLayout></CookiesBoundary>
}

function StudioLayout({ children }: { children: ReactNode }) {
    const { t } = useTranslationClient('studio')
    const [ myUser, setMyUser ] = useState<User>()
    useEffect(() => {
        (async () => {
            setMyUser((await getMyUser())!)
        })()
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
                    <SidebarLogo href="/core" img="/assets/logo.png"><span
                        className="font-display">BAID Speaker</span></SidebarLogo>
                    <SidebarItems>
                        <SidebarItemGroup>
                            <Link href="/studio">
                                <SidebarItem as="div" icon={HiChartPie}>
                                    {t('nav.dashboard')}
                                </SidebarItem>
                            </Link>
                            <Link href="/studio/lectures">
                                <SidebarItem icon={HiAcademicCap}>
                                    {t('nav.lectures')}
                                </SidebarItem>
                            </Link>
                            <If condition={myUser?.permissions.includes('admin.manage')}>
                                <SidebarCollapse label="Management" icon={HiCog}>
                                    <Link href="/studio/users">
                                        <SidebarItem icon={HiUsers}>
                                            {t('nav.user')}
                                        </SidebarItem>
                                    </Link>
                                </SidebarCollapse>
                            </If>
                        </SidebarItemGroup>
                    </SidebarItems>
                    <div className="mr-3 mb-3 absolute bottom-0">
                        <Link href="/studio/settings"
                              className="flex items-center gap-3 rounded-full p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-100">
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
