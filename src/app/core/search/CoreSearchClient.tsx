'use client'

import { useTranslationClient } from '@/app/i18n/client'
import { Pagination } from 'flowbite-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { HydratedLecture, Paginated, searchPublicLectures } from '@/app/lib/lecture-actions'
import If from '@/app/lib/If'
import { LectureStatus } from '@prisma/client'
import { Trans } from 'react-i18next/TransWithoutContext'

export default function CoreSearchClient({ lectures, uploadServePath, query }: {
    lectures: Paginated<HydratedLecture>,
    uploadServePath: string,
    query: string
}) {
    const { t } = useTranslationClient('core')

    const [ currentPage, setCurrentPage ] = useState(0)
    const [ page, setPage ] = useState<Paginated<HydratedLecture>>(lectures)

    useEffect(() => {
        (async () => {
            if (page.page !== currentPage) {
                setPage(await searchPublicLectures(currentPage, query))
            }
        })()
    }, [ currentPage, query ])

    return <div className="base-studio-page">
        <If condition={page.pages < 1}>
            <div className="w-full h-[60dvh] flex flex-col justify-center items-center">
                <img src="/assets/illustrations/art-light.png" className="dark:hidden w-72" alt=""/>
                <img src="/assets/illustrations/art-dark.png" className="hidden dark:block w-72" alt=""/>
                <p className="mb-3">{t('search.empty')}</p>
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
                            <p className="text-xs secondary">
                                <If condition={lecture.liveAudience != null}>
                                    <Trans t={t} i18nKey="home.liveViews" count={lecture.liveAudience ?? 0}/> •&nbsp;
                                </If>
                                <Trans t={t} i18nKey="home.videoViews" count={lecture.viewedUsers.length}/>
                            </p>
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
