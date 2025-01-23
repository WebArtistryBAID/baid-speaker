import { ReactNode } from 'react'
import { Button, Navbar, NavbarBrand } from 'flowbite-react'
import Link from 'next/link'
import { serverTranslation } from '@/app/i18n'

export default async function coreLayout({ children }: { children: ReactNode }) {
    const { t } = await serverTranslation('core')

    return <>
        <Navbar fluid rounded>
            <NavbarBrand as={Link} href="/core">
                <img src="/assets/logo.png" className="mr-3 h-6" alt="BAID Speaker Logo"/>
                <span className="font-bold font-display text-xl">BAID Speaker</span>
            </NavbarBrand>
            <div className="hidden lg:flex">
                <Button pill color="blue" as={Link} href="/studio">
                    {t('studio')}
                </Button>
            </div>
        </Navbar>
        {children}
    </>
}
