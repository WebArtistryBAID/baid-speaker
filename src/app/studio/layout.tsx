'use client'

import { ReactNode } from 'react'
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
import { HiAcademicCap, HiChartPie, HiCog, HiCollection, HiInbox, HiLogout, HiUsers } from 'react-icons/hi'
import Link from 'next/link'
import { useTranslationClient } from '@/app/i18n/client'
import If from '@/app/lib/If'
import { useCachedUser } from '@/app/login/login-client'
import { useCookies } from 'react-cookie'

export default function StudioLayout({ children }: { children: ReactNode }) {
    const { t } = useTranslationClient('studio')
    const user = useCachedUser()
    const removeCookie = useCookies()[2]

    return <div className="h-screen flex">
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
                        <SidebarItem as={Link} href="/studio/inbox" icon={HiInbox}>
                            {t('nav.inbox')}
                        </SidebarItem>
                        <If condition={user?.permissions.includes('admin.manage')}>
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
                    <div className="flex items-center gap-3">
                        <button className="btn-icon-only" onClick={() => {
                            removeCookie('access_token', { path: '/' })
                            location.reload() // Special case reload: We aren't using router to force a full reload
                        }}>
                            <HiLogout/>
                        </button>
                        <p className="font-display text-xl">{user?.name}</p>
                    </div>
                    <SidebarCTA>
                        <Badge color="warning" className="inline-block mb-3">{t('nav.beta')}</Badge>
                        <p className="secondary text-sm">
                            {t('nav.betaDetails')}
                        </p>
                    </SidebarCTA>
                </div>
            </Sidebar>
        </div>
        <div className="flex-grow h-screen min-h-screen overflow-y-auto">
            {children}
        </div>
    </div>
}