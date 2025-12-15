import { Button, Navbar, NavbarBrand } from 'flowbite-react'
import Link from 'next/link'
import { serverTranslation } from '@/app/i18n'
import { getMyUser } from '@/app/login/login-actions'
import { HiSearch } from 'react-icons/hi'
import SearchBar from '@/app/core/SearchBar'
import CookiesBoundary from '@/app/lib/CookiesBoundary'

export default async function SimpleNav() {
    const { t } = await serverTranslation('core')
    const user = await getMyUser()

    return <Navbar fluid rounded>
        <Link href="/core">
            <NavbarBrand as="div">
                <img src="/assets/logo.png" className="mr-3 h-8 lg:h-10" alt="BAID Speaker Logo"/>
                <span className="font-bold font-display text-xl hidden lg:block">BAID Speaker</span>
            </NavbarBrand>
        </Link>

        <div className="hidden lg:flex w-1/2 xl:w-1/3">
            <CookiesBoundary><SearchBar/></CookiesBoundary>
        </div>

        <div className="lg:hidden">
            <Link href="/core/search" className="btn-icon-only w-8 h-8" aria-label="Search">
                <HiSearch/>
            </Link>
        </div>
        <div className="hidden lg:flex gap-3">
            {user != null && user.permissions.includes('admin.manage') &&
                <Link href="/studio">
                    <Button pill color="blue" as="div">
                        {t('studio')}
                    </Button>
                </Link>}
            {user != null && <Link href="/studio/settings" className="btn-icon-only w-10 h-10" aria-label="User Icon">
                <span className="font-bold">{(user ?? 'a').name.at(0)}</span>
            </Link>}
        </div>
    </Navbar>
}
