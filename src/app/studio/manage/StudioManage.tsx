'use client'

import { useTranslationClient } from '@/app/i18n/client'
import { TabItem, Tabs } from 'flowbite-react'
import { HiCheckCircle, HiClock } from 'react-icons/hi'
import { HiEllipsisHorizontalCircle, HiListBullet } from 'react-icons/hi2'
import UnassignedLectures from '@/app/studio/manage/UnassignedLectures'
import TypicalLectures from '@/app/studio/manage/TypicalLectures'
import { LectureStatus } from '@prisma/client'

export default function StudioManage() {
    const { t } = useTranslationClient('studio')
    return <div className="base-studio-page">
        <h1 className="mb-5">{t('manage.title')}</h1>
        <Tabs aria-label={t('manage.tabs.title')} variant="underline">
            <TabItem active title={t('manage.tabs.unassigned')} icon={HiClock}>
                <UnassignedLectures/>
            </TabItem>
            <TabItem title={t('manage.tabs.inProgress')} icon={HiEllipsisHorizontalCircle}>
                <TypicalLectures filter={{
                    NOT: {
                        status: LectureStatus.completed
                    }
                }}/>
            </TabItem>
            <TabItem title={t('manage.tabs.completed')} icon={HiCheckCircle}>
                <TypicalLectures filter={{ status: LectureStatus.completed }}/>
            </TabItem>
            <TabItem title={t('manage.tabs.all')} icon={HiListBullet}>
                <TypicalLectures filter={{}}/>
            </TabItem>
        </Tabs>
    </div>
}
