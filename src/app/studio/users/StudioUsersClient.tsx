'use client'

import { Paginated } from '@/app/lib/lecture-actions'
import { User } from '@prisma/client'
import { useTranslationClient } from '@/app/i18n/client'
import { useEffect, useState } from 'react'
import { getUsers } from '@/app/login/login-actions'
import {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TextInput
} from 'flowbite-react'
import { HiColorSwatch, HiSearch } from 'react-icons/hi'
import Link from 'next/link'

export default function StudioUsersClient({ users }: { users: Paginated<User> }) {
    const { t } = useTranslationClient('studio')
    const [ currentPage, setCurrentPage ] = useState(0)
    const [ keyword, setKeyword ] = useState<string>('')
    const [ page, setPage ] = useState<Paginated<User>>(users)

    useEffect(() => {
        (async () => {
            setPage(await getUsers(currentPage, keyword))
        })()
    }, [ currentPage, keyword ])

    return <div className="base-studio-page">
        <Breadcrumb aria-label={t('breadcrumb.bc')} className="mb-3">
            <BreadcrumbItem href="/studio" icon={HiColorSwatch}>{t('breadcrumb.studio')}</BreadcrumbItem>
            <BreadcrumbItem>{t('breadcrumb.users')}</BreadcrumbItem>
        </Breadcrumb>
        <h1 className="mb-5">{t('users.title')}</h1>
        <div className="mb-5 max-w-md">
            <TextInput type="name" icon={HiSearch} value={keyword} onChange={e => setKeyword(e.currentTarget.value)}
                       placeholder={t('users.search')}/>
        </div>
        <Table className="mb-8">
            <TableBody className="divide-y">
                {page.items.map(user => <TableRow className="tr" key={user.id}>
                    <TableCell className="th w-4/5">{user.name}</TableCell>
                    <TableCell className="w-1/5">
                        <Button className="inline-block" color="blue" as={Link} href={`/studio/users/${user.id}`} pill
                                size="xs">{t('users.view')}</Button>
                    </TableCell>
                </TableRow>)}
            </TableBody>
        </Table>

        <div className="flex overflow-x-auto sm:justify-center">
            <Pagination currentPage={currentPage + 1} onPageChange={p => setCurrentPage(p - 1)}
                        totalPages={page.pages}/>
        </div>
    </div>
}
