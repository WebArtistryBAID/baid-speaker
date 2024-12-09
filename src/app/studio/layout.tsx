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
import { HiAcademicCap, HiChartPie, HiCog, HiCollection, HiInbox, HiUsers } from 'react-icons/hi'
import Link from 'next/link'
import { useTranslationClient } from '@/app/i18n/client'
import { getMyUser } from '@/app/login/login-actions'
import { User } from '@prisma/client'

export default function StudioLayout({ children }: { children: ReactNode }) {
    const { t } = useTranslationClient('studio')
    const [ myUser, setMyUser ] = useState<User>()

    useEffect(() => {
        (async () => {
            setMyUser((await getMyUser())!)
        })()
    }, [])

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
                        <SidebarCollapse label="Management" icon={HiCog}>
                            <SidebarItem as={Link} href="/studio/manage" icon={HiCollection}>
                                {t('nav.manage')}
                            </SidebarItem>
                            <SidebarItem as={Link} href="/studio/users" icon={HiUsers}>
                                {t('nav.user')}
                            </SidebarItem>
                        </SidebarCollapse>
                    </SidebarItemGroup>
                </SidebarItems>
                <div className="mr-3 mb-3 absolute bottom-0">
                    <p className="text-sm">{t('nav.login', { name: myUser?.name })}</p>
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