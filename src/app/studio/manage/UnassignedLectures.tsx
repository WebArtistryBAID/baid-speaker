'use client'

import { useEffect, useState } from 'react'
import { claimLecture, getUnassignedLectures, HydratedLecture } from '@/app/lib/lecture-actions'
import { Button, Card } from 'flowbite-react'
import { useTranslationClient } from '@/app/i18n/client'
import { useRouter } from 'next/navigation'
import If from '@/app/lib/If'
import { HiRefresh, HiSpeakerphone } from 'react-icons/hi'
import { getMyUser } from '@/app/login/login-actions'
import { User } from '@prisma/client'

export default function UnassignedLectures() {
    const {t} = useTranslationClient('studio')
    const [unassignedLectures, setUnassignedLectures] = useState<HydratedLecture[] | null>(null)
    const [loading, setLoading] = useState(false)
    const [ me, setMe ] = useState<User | null>(null)
    const router = useRouter()

    function claim(lecture: HydratedLecture) {
        setLoading(true);
        (async () => {
            await claimLecture(lecture.id)
            router.replace(`/studio/lectures/${lecture.id}`)
        })()
    }

    useEffect(() => {
        (async () => {
            setUnassignedLectures(await getUnassignedLectures())
            setMe(await getMyUser())
        })()
    }, [])
    if (unassignedLectures == null || me == null) {
        return <div className="w-full">
            <div className="w-1/3 h-8 bg-gray-300 dark:bg-gray-700 rounded-3xl mb-3"/>
            <div className="w-1/2 h-8 bg-gray-300 dark:bg-gray-700 rounded-3xl mb-3"/>
            <div className="w-full h-8 bg-gray-300 dark:bg-gray-700 rounded-3xl mb-3"/>
        </div>
    }
    return <>
        <If condition={unassignedLectures.length < 1}>
            <div className="w-full flex flex-col justify-center items-center">
                <img src="/assets/illustrations/good-job-light.png" className="dark:hidden w-72 mb-3" alt=""/>
                <img src="/assets/illustrations/good-job-dark.png" className="hidden dark:block w-72 mb-3" alt=""/>
                <p>{t('manage.unassigned.empty')}</p>
            </div>
        </If>
        <If condition={unassignedLectures.length > 0}>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-8">
                {unassignedLectures.map(lecture => <Card key={lecture.id} className="col-span-2">
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

                    <Button disabled={loading} color="blue"
                            onClick={() => claim(lecture)}>{t('manage.unassigned.claim')}</Button>
                </Card>)}
            </div>
        </If>
    </>
}
