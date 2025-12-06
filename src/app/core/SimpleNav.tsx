import { Button, Navbar, NavbarBrand } from 'flowbite-react'
import Link from 'next/link'
import { serverTranslation } from '@/app/i18n'
import { getMyUser } from '@/app/login/login-actions'
import { HiSearch } from 'react-icons/hi'
import SearchBar from '@/app/core/SearchBar'
import { CookiesProvider } from 'react-cookie'

export default async function SimpleNav() {
    const {t} = await serverTranslation('core')
    const user = await getMyUser()

    return <Navbar fluid rounded>
        <NavbarBrand as={Link} href="/core">
            <img src="/assets/logo.png" className="mr-3 h-8 lg:h-10" alt="BAID Speaker Logo"/>
            <span className="font-bold font-display text-xl hidden lg:block">BAID Speaker</span>
        </NavbarBrand>

        <div className="hidden lg:flex w-1/2 xl:w-1/3">
            <CookiesProvider><SearchBar/></CookiesProvider>
        </div>

        <div className="lg:hidden">
            <Link href="/core/search" className="btn-icon-only w-8 h-8" aria-label="Search">
                <HiSearch/>
            </Link>
        </div>
        <div className="hidden lg:flex gap-3">
            {user != null && user.permissions.includes('admin.manage') &&
                <Button pill color="blue" as={Link} href="/studio">
                {t('studio')}
                </Button>}
            {user != null && <Link href="/studio/settings" className="btn-icon-only w-10 h-10" aria-label="User Icon">
                <span className="font-bold">{(user ?? 'a').name.at(0)}</span>
            </Link>}
        </div>
    </Navbar>
}
