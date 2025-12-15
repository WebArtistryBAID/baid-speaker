'use client'

import { useTranslationClient } from '@/app/i18n/client'
import { useEffect, useState } from 'react'
import { User } from '@/generated/prisma/browser'
import { getMyUser } from '@/app/login/login-actions'
import { Button, Navbar, NavbarBrand } from 'flowbite-react'
import Link from 'next/link'
import SearchBar from '@/app/core/SearchBar'

export default function AlwaysSearchNav() {
    const { t } = useTranslationClient('core')
    const [ myUser, setMyUser ] = useState<User>()
    useEffect(() => {
        (async () => {
            setMyUser((await getMyUser())!)
        })()
    }, [])

    return <Navbar fluid rounded>
        <Link href="/core">
            <NavbarBrand as="div" className="hidden lg:flex">
                <img src="/assets/logo.png" className="mr-3 h-8 lg:h-10" alt="BAID Speaker Logo"/>
                <span className="font-bold font-display text-xl hidden lg:block">BAID Speaker</span>
            </NavbarBrand>
        </Link>

        <div className="flex w-full lg:w-1/2 xl:w-1/3">
            <SearchBar/>
        </div>

        <div className="hidden lg:flex gap-3">
            <Link href="/studio">
                <Button pill color="blue" as="div">
                    {t('studio')}
                </Button>
            </Link>
            {myUser != null && <Link href="/studio/settings" className="btn-icon-only w-10 h-10" aria-label="User Icon">
                <span className="font-bold">{myUser?.name.at(0)}</span>
            </Link>}
        </div>
    </Navbar>
}
