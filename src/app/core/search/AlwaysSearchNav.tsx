'use client'

import {useTranslationClient} from '@/app/i18n/client'
import {useEffect, useState} from 'react'
import {User} from '@prisma/client'
import {getMyUser} from '@/app/login/login-actions'
import {Button, Navbar, NavbarBrand} from 'flowbite-react'
import Link from 'next/link'
import SearchBar from '@/app/core/SearchBar'

export default function AlwaysSearchNav() {
    const {t} = useTranslationClient('core')
    const [myUser, setMyUser] = useState<User>()
    useEffect(() => {
        (async () => {
            setMyUser((await getMyUser())!)
        })()
    }, [])

    return <Navbar fluid rounded>
        <NavbarBrand as={Link} href="/core" className="hidden lg:flex">
            <img src="/assets/logo.png" className="mr-3 h-8 lg:h-10" alt="BAID Speaker Logo"/>
            <span className="font-bold font-display text-xl hidden lg:block">BAID Speaker</span>
        </NavbarBrand>

        <div className="flex w-full lg:w-1/2 xl:w-1/3">
            <SearchBar/>
        </div>

        <div className="hidden lg:flex gap-3">
            <Button pill color="blue" as={Link} href="/studio">
                {t('studio')}
            </Button>
            <Link href="/studio/settings" className="btn-icon-only w-10 h-10" aria-label="User Icon">
                <span className="font-bold">{myUser?.name.at(0)}</span>
            </Link>
        </div>
    </Navbar>
}
