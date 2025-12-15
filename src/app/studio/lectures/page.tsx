'use client'

import { useTranslationClient } from '@/app/i18n/client'
import { useEffect, useState } from 'react'
import { getMyLectures, HydratedLecture, Paginated } from '@/app/lib/lecture-actions'
import If from '@/app/lib/If'
import { Breadcrumb, BreadcrumbItem, Button, Card, Pagination } from 'flowbite-react'
import Link from 'next/link'
import { useCachedUser } from '@/app/login/login-client'
import { HiColorSwatch, HiRefresh } from 'react-icons/hi'

export default function StudioLectures() {
    const { t } = useTranslationClient('studio')
    const me = useCachedUser()
    const [ currentPage, setCurrentPage ] = useState(0)
    const [ page, setPage ] = useState<Paginated<HydratedLecture> | null>(null)

    useEffect(() => {
        (async () => {
            setPage(await getMyLectures(currentPage))
        })()
    }, [ currentPage ])

    if (page == null || me == null) {
        return <div className="base-studio-page">
            <h1 className="mb-8">{t('nav.lectures')}</h1>
            <div className="w-full">
                <div className="w-1/3 h-8 bg-gray-300 dark:bg-gray-700 rounded-3xl mb-3"/>
                <div className="w-1/2 h-8 bg-gray-300 dark:bg-gray-700 rounded-3xl mb-3"/>
                <div className="w-full h-8 bg-gray-300 dark:bg-gray-700 rounded-3xl mb-3"/>
            </div>
        </div>
    }

    return <div className="base-studio-page">
        <Breadcrumb aria-label={t('breadcrumb.bc')} className="mb-3">
            <BreadcrumbItem href="/studio" icon={HiColorSwatch}>{t('breadcrumb.studio')}</BreadcrumbItem>
            <BreadcrumbItem>{t('breadcrumb.lectures')}</BreadcrumbItem>
        </Breadcrumb>
        <h1 className="mb-8">{t('nav.lectures')}</h1>
        <If condition={page.pages < 1}>
            <div className="w-full h-[60dvh] flex flex-col justify-center items-center">
                <img src="/assets/illustrations/hi-light.png" className="dark:hidden w-72" alt=""/>
                <img src="/assets/illustrations/hi-dark.png" className="hidden dark:block w-72" alt=""/>
                <p className="mb-3">{t('myLectures.empty')}</p>
                <Link href="/studio/lectures/create"><Button color="blue" as="div">{t('myLectures.startLecture')}</Button></Link>
            </div>
        </If>
        <If condition={page.pages >= 1}>
            <Link href="/studio/lectures/create"><Button className="mb-5 inline-block" color="blue" as="div">{t('myLectures.startLecture')}</Button></Link>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-8">
                {page.items.map(lecture => <Card key={lecture.id} className="col-span-2">
                    <h2>{lecture.title}</h2>
                    <div className="flex items-center mb-3">
                        <div className="mr-3">
                            <div className="rounded-full flex justify-center items-center bg-blue-500 w-8 h-8">
                                <HiRefresh
                                    className="text-white"/></div>
                        </div>
                        <p>{t('myLectures.lastUpdated')}<span
                            className="font-bold">{lecture.updatedAt.toLocaleString()}</span></p>
                    </div>

                    <Link href={`/studio/lectures/${lecture.id}`}><Button color="blue" as="div">{t('myLectures.cta')}</Button></Link>
                </Card>)}
            </div>
            <div className="flex overflow-x-auto sm:justify-center">
                <If condition={page.pages > 0}>
                    <Pagination currentPage={currentPage + 1} onPageChange={p => setCurrentPage(p - 1)}
                                totalPages={page.pages}/>
                </If>
            </div>
        </If>
    </div>
}
