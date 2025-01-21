'use client'

import { useTranslationClient } from '@/app/i18n/client'
import { useEffect, useState } from 'react'
import { getMyLectures, HydratedLecture, Paginated } from '@/app/lib/lecture-actions'
import If from '@/app/lib/If'
import { Button, Card, Pagination } from 'flowbite-react'
import Link from 'next/link'
import { LectureRoleIconCircle, LectureStatusIconCircle } from '@/app/lib/lecture-icons'
import { useCachedUser } from '@/app/login/login-client'
import { HiRefresh } from 'react-icons/hi'

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
        <h1 className="mb-8">{t('nav.lectures')}</h1>
        <If condition={page.pages < 1}>
            <div className="w-full h-[60dvh] flex flex-col justify-center items-center">
                <img src="/assets/illustrations/hi-light.png" className="dark:hidden w-72" alt=""/>
                <img src="/assets/illustrations/hi-dark.png" className="hidden dark:block w-72" alt=""/>
                <p className="mb-3">{t('myLectures.empty')}</p>
                <Button color="blue" as={Link} href="/studio/lectures/create">{t('myLectures.startLecture')}</Button>
            </div>
        </If>
        <If condition={page.pages >= 1}>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-8">
                {page.items.map(lecture => <Card key={lecture.id} className="col-span-2">
                    <h2>{lecture.title}</h2>
                    <div className="flex items-center">
                        <div className="mr-3">
                            <LectureStatusIconCircle status={lecture.status}/>
                        </div>
                        <p>{t('myLectures.status')}<span
                            className="font-bold">{t(`lectureStatus.${lecture.status}.name`)}</span></p>
                    </div>

                    <div className="flex items-center">
                        <div className="mr-3">
                            <LectureRoleIconCircle lecture={lecture} user={me}/>
                        </div>
                        <p>{t('myLectures.role')}
                            <span className="font-bold">
                            <If condition={lecture.userId === me.id}>{t('myLectures.speaker')}</If>
                            <If condition={lecture.assigneeId === me.id}>{t('myLectures.host')}</If>
                            <If condition={lecture.assigneeTeacherId === me.id}>{t('myLectures.teacher')}</If>
                            <If condition={lecture.posterAssigneeId === me.id}>{t('myLectures.poster')}</If>
                                </span>
                        </p>
                    </div>

                    <div className="flex items-center mb-3">
                        <div className="mr-3">
                            <div className="rounded-full flex justify-center items-center bg-blue-500 w-8 h-8">
                                <HiRefresh
                                    className="text-white"/></div>
                        </div>
                        <p>{t('myLectures.lastUpdated')}<span
                            className="font-bold">{lecture.updatedAt.toLocaleString()}</span></p>
                    </div>

                    <Button color="blue" as={Link}
                            href={`/studio/lectures/${lecture.id}`}>{t('myLectures.cta')}</Button>
                </Card>)}
            </div>
            <div className="flex overflow-x-auto sm:justify-center">
                <Pagination currentPage={currentPage + 1} onPageChange={p => setCurrentPage(p - 1)}
                            totalPages={page.pages}/>
            </div>
        </If>
    </div>
}
