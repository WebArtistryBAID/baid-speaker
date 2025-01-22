'use client'

import { useTranslationClient } from '@/app/i18n/client'
import { useEffect, useState } from 'react'
import { getLectures, HydratedLecture, Paginated } from '@/app/lib/lecture-actions'
import { Prisma, User } from '@prisma/client'
import { getMyUser } from '@/app/login/login-actions'
import If from '@/app/lib/If'
import { Button, Card, Pagination } from 'flowbite-react'
import { HiRefresh, HiSpeakerphone } from 'react-icons/hi'
import Link from 'next/link'
import LectureWhereInput = Prisma.LectureWhereInput

export default function TypicalLectures({ filter }: { filter: LectureWhereInput }) {
    const { t } = useTranslationClient('studio')
    const [ me, setMe ] = useState<User | null>(null)
    const [ currentPage, setCurrentPage ] = useState(0)
    const [ page, setPage ] = useState<Paginated<HydratedLecture> | null>(null)

    useEffect(() => {
        (async () => {
            setMe(await getMyUser())
        })()
    }, [])

    useEffect(() => {
        (async () => {
            setPage(await getLectures(currentPage, filter))
        })()
    }, [ currentPage, filter ])

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

    return <>
        <If condition={page.pages < 1}>
            <div className="w-full flex flex-col justify-center items-center">
                <img src="/assets/illustrations/travel-intl-light.png" className="dark:hidden w-72 mb-3" alt=""/>
                <img src="/assets/illustrations/travel-intl-dark.png" className="hidden dark:block w-72 mb-3" alt=""/>
                <p>{t('manage.typical.empty')}</p>
            </div>
        </If>
        <If condition={page.pages > 0}>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-8">
                {page.items.map(lecture => <Card key={lecture.id} className="col-span-2">
                    <h2>{lecture.title}</h2>
                    <div className="flex items-center">
                        <div className="mr-3">
                            <div className="rounded-full flex justify-center items-center bg-blue-500 w-8 h-8">
                                <HiSpeakerphone
                                    className="text-white"/></div>
                        </div>
                        <p>{t('manage.speaker')}<span className="font-bold">{lecture.user.name}</span></p>
                    </div>

                    <div className="flex items-center mb-3">
                        <div className="mr-3">
                            <div className="rounded-full flex justify-center items-center bg-blue-500 w-8 h-8">
                                <HiRefresh
                                    className="text-white"/></div>
                        </div>
                        <p>{t('manage.lastUpdated')}<span
                            className="font-bold">{lecture.updatedAt.toLocaleString()}</span></p>
                    </div>

                    <Button as={Link} color="blue"
                            href={`/studio/lectures/${lecture.id}`}>{t('manage.typical.view')}</Button>
                </Card>)}
            </div>

            <div className="flex overflow-x-auto sm:justify-center">
                <Pagination currentPage={currentPage + 1} onPageChange={p => setCurrentPage(p - 1)}
                            totalPages={page.pages}/>
            </div>
        </If>
    </>
}
