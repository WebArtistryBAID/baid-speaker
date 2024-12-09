'use client'

import { useTranslationClient } from '@/app/i18n/client'
import { TabItem, Tabs, TabsRef } from 'flowbite-react'
import { HiCalendar, HiChartPie, HiDocumentText, HiRefresh, HiUsers } from 'react-icons/hi'
import { HydratedLecture } from '@/app/lib/lecture-actions'
import { useRef } from 'react'
import LectureDashboard from '@/app/studio/lectures/[id]/LectureDashboard'
import LectureTasksC from '@/app/studio/lectures/[id]/LectureTasks'
import LectureUsers from '@/app/studio/lectures/[id]/LectureUsers'

export default function StudioLecture({ lecture }: { lecture: HydratedLecture }) {
    const { t } = useTranslationClient('studio')
    const tabsRef = useRef<TabsRef>(null)

    return <div className="base-studio-page">
        <h1 className="mb-3">{lecture.title}</h1>
        <p className="text-xl mb-5 secondary">{lecture.user.name}</p>
        <Tabs aria-label={t('lecture.tabs.title')} variant="underline" ref={tabsRef}>
            <TabItem active title={t('lecture.tabs.dashboard')} icon={HiChartPie}>
                <LectureDashboard lecture={lecture} tabsRef={tabsRef.current!}/>
            </TabItem>
            <TabItem title={t('lecture.tabs.tasks')} icon={HiCalendar}>
                <LectureTasksC lecture={lecture}/>
            </TabItem>
            <TabItem title={t('lecture.tabs.users')} icon={HiUsers}>
                <LectureUsers lecture={lecture}/>
            </TabItem>
            <TabItem title={t('lecture.tabs.history')} icon={HiRefresh}>

            </TabItem>
            <TabItem title={t('lecture.tabs.content')} icon={HiDocumentText}>

            </TabItem>
        </Tabs>
    </div>
}
