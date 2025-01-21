'use client'

import { HydratedLecture } from '@/app/lib/lecture-actions'
import { useTranslationClient } from '@/app/i18n/client'
import { LectureStatus } from '@prisma/client'
import { HiInbox } from 'react-icons/hi'
import { Button, Card } from 'flowbite-react'
import If from '@/app/lib/If'

export default function LectureStatistics({ lecture, uploadServePath }: {
    lecture: HydratedLecture,
    uploadServePath: string
}) {
    const { t } = useTranslationClient('studio')

    if (lecture.status !== LectureStatus.completingPostTasks && lecture.status !== LectureStatus.completed) {
        return <div className="w-full flex flex-col justify-center items-center">
            <HiInbox className="text-7xl mb-3 secondary"/>
            <p>{t('lecture.statistics.empty')}</p>
        </div>
    }

    return <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-8">
        <Card className="col-span-1 h-full w-full relative">
            <h2>{t('lecture.statistics.videoTitle')}</h2>
            <If condition={lecture.uploadedVideo != null}>
                <p className="secondary">{t('lecture.statistics.videoAvailable')}</p>
                <Button color="blue" href={`/watch/${lecture.id}`}>
                    {t('lecture.content.videoCta')}
                </Button>
            </If>
            <If condition={lecture.uploadedVideo == null}>
                <p className="secondary">{t('lecture.statistics.videoWaiting')}</p>
            </If>
        </Card>
        <Card>
            <p className="secondary text-sm font-display">{t('lecture.statistics.liveAudience')}</p>
            <div className="flex flex-col w-full justify-center items-center h-full">
                <p className="text-7xl mb-3 font-display font-bold text-blue-500 dark:text-white">{lecture.liveAudience ?? '...'}</p>
                <p>{t('lecture.statistics.liveAudience')}</p>
            </div>
        </Card>
        <Card>
            <p className="secondary text-sm font-display">{t('lecture.statistics.videoViews')}</p>
            <div className="flex flex-col w-full justify-center items-center h-full">
                <p className="text-7xl mb-3 font-display font-bold text-blue-500 dark:text-white">{lecture.videoViews ?? '...'}</p>
                <p>{t('lecture.statistics.videoViews')}</p>
            </div>
        </Card>
        <Card>
            <p className="secondary text-sm font-display">{t('lecture.statistics.videoLikes')}</p>
            <div className="flex flex-col w-full justify-center items-center h-full">
                <p className="text-7xl mb-3 font-display font-bold text-blue-500 dark:text-white">{lecture.videoLikes ?? '...'}</p>
                <p>{t('lecture.statistics.videoLikes')}</p>
            </div>
        </Card>
        <If condition={lecture.uploadedFeedback != null}>
            <div className="col-span-1 h-full w-full flex flex-col">
                <a className="block flex-grow" href={`${uploadServePath}${lecture.uploadedFeedback}`}>
                    <img src={`${uploadServePath}${lecture.uploadedFeedback}`} alt={t(`lecture.statistics.feedback`)}
                         className="w-full h-auto rounded-t-3xl"/>
                </a>
                <div className="w-full p-5 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-b-3xl">
                    <p className="text-xl font-display">
                        {t('lecture.statistics.feedback')}
                    </p>
                </div>
            </div>
        </If>
    </div>
}
