'use client'

import { useTranslationClient } from '@/app/i18n/client'
import { Button, Pagination } from 'flowbite-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getPublicLectures, HydratedLecture, Paginated } from '@/app/lib/lecture-actions'
import If from '@/app/lib/If'
import { LectureStatus } from '@prisma/client'

export default function CoreClient({ lectures, uploadServePath }: {
    lectures: Paginated<HydratedLecture>,
    uploadServePath: string
}) {
    const { t } = useTranslationClient('core')

    const [ currentPage, setCurrentPage ] = useState(0)
    const [ page, setPage ] = useState<Paginated<HydratedLecture>>(lectures)

    useEffect(() => {
        (async () => {
            if (page.page !== currentPage) {
                setPage(await getPublicLectures(currentPage))
            }
        })()
    }, [ currentPage ])

    return <div className="base-studio-page">
        <If condition={currentPage === 0}>
            <div className="lg:px-24 xl:px-48 2xl:px-72 mb-16">
                <img src="/assets/logo.png" alt="BAID Speaker Logo" className="w-20 mb-5"/>
                <h1 className="mb-3">{t('home.welcomeTitle')}</h1>
                <p className="mb-5">{t('home.welcomeSubtitle')}</p>
                <div className="flex items-center gap-3">
                    <Button pill color="blue" as={Link} href="/studio" className="inline-block">{t('home.cta')}</Button>
                    <p className="text-sm secondary">{t('home.ctaSide')}</p>
                </div>
            </div>
        </If>

        <If condition={page.pages > 0}>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-8">
                {page.items.map(lecture => <Link href={`/core/lecture/${lecture.id}`} key={lecture.id}
                                                 className="bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-800 rounded-3xl block transition-colors duration-100">
                    <img src={uploadServePath + lecture.uploadedPoster!} alt={lecture.title}
                         className="w-full object-cover h-48"/>
                    <div className="p-5">
                        <p className="font-bold text-sm mb-2">{lecture.title}</p>
                        <p className="text-xs secondary font-bold">{lecture.user.name}</p>
                        <If condition={lecture.date != null}>
                            <If condition={lecture.date!.getTime() > Date.now()}>
                                <p className="text-xs secondary">{t('home.upcoming', { date: lecture.date?.toLocaleDateString().replaceAll('/', '-') })}</p>
                            </If>
                            <If condition={lecture.date!.getTime() <= Date.now()}>
                                <p className="text-xs secondary">{lecture.date?.toLocaleDateString().replaceAll('/', '-')}</p>
                            </If>
                        </If>
                        <If condition={lecture.status === LectureStatus.completingPostTasks || lecture.status === LectureStatus.completed}>
                            <If condition={lecture.liveAudience == null}>
                                <p className="text-xs secondary">{t('home.statsViewOnly', { view: lecture.videoViews })}</p>
                            </If>
                            <If condition={lecture.liveAudience != null}>
                                <p className="text-xs secondary">{t('home.stats', {
                                    live: lecture.liveAudience,
                                    view: lecture.videoViews
                                })}</p>
                            </If>
                        </If>
                    </div>
                </Link>)}
            </div>
        </If>

        <div className="flex overflow-x-auto sm:justify-center">
            <Pagination currentPage={currentPage + 1} onPageChange={p => setCurrentPage(p - 1)}
                        totalPages={page.pages}/>
        </div>
    </div>
}
