'use client'

import { TextInput } from 'flowbite-react'
import Link from 'next/link'
import { HiSearch } from 'react-icons/hi'
import { useTranslationClient } from '@/app/i18n/client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SearchBar() {
    const { t } = useTranslationClient('core')
    const searchParams = useSearchParams()
    const [ search, setSearch ] = useState('')
    const router = useRouter()

    useEffect(() => {
        const q = searchParams.get('q')
        if (q != null) {
            setSearch(q)
        }
    }, [ searchParams ])

    return <>
        <TextInput placeholder={t('search.placeholder')} type="text" className="w-full" value={search}
                   onChange={e => setSearch(e.currentTarget.value)}
                   onKeyUp={e => {
                       if (e.key === 'Enter') {
                           e.preventDefault()
                           router.push(`/core/search?q=${search}`)
                       }
                   }}/>
        <div className="hidden lg:block">
            <Link href={`/core/search?q=${search}`} className="btn-icon-only w-10 h-10 ml-3" aria-label="Search">
                <HiSearch/>
            </Link>
        </div>
    </>
}
