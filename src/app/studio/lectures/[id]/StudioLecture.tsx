'use client'

import {useTranslationClient} from '@/app/i18n/client'
import {Alert, TabItem, Tabs, TabsRef} from 'flowbite-react'
import {HiCalendar, HiChartBar, HiChartPie, HiDocumentText, HiRefresh, HiUsers} from 'react-icons/hi'
import {HydratedLecture} from '@/app/lib/lecture-actions'
import {useEffect, useRef, useState} from 'react'
import LectureDashboard from '@/app/studio/lectures/[id]/LectureDashboard'
import LectureTasksC from '@/app/studio/lectures/[id]/LectureTasks'
import LectureUsers from '@/app/studio/lectures/[id]/LectureUsers'
import If from '@/app/lib/If'
import {User} from '@prisma/client'
import {getMyUser} from '@/app/login/login-actions'
import LectureHistory from '@/app/studio/lectures/[id]/LectureHistory'

export default function StudioLecture({ lecture }: { lecture: HydratedLecture }) {
    const { t } = useTranslationClient('studio')
    const tabsRef = useRef<TabsRef>(null)

    const [ myUser, setMyUser ] = useState<User>()

    useEffect(() => {
        (async () => {
            setMyUser((await getMyUser())!)
        })()
    }, [])

    if (myUser == null) {
        return <div className="base-studio-page">
            <div className="w-full">
                <div className="w-1/3 h-8 bg-gray-300 dark:bg-gray-700 rounded-3xl mb-3"/>
                <div className="w-1/2 h-8 bg-gray-300 dark:bg-gray-700 rounded-3xl mb-3"/>
                <div className="w-full h-8 bg-gray-300 dark:bg-gray-700 rounded-3xl mb-3"/>
            </div>
        </div>
    }

    return <div className="base-studio-page">
        <h1 className="mb-3">{lecture.title}</h1>
        <p className="text-xl mb-5 secondary">{lecture.user.name}</p>
        <If condition={myUser.id !== lecture.user.id}>
            <Alert color="info" className="mb-3">{t('lecture.userAlert')}</Alert>
        </If>
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
                <LectureHistory lecture={lecture}/>
            </TabItem>
            <TabItem title={t('lecture.tabs.content')} icon={HiDocumentText}>

            </TabItem>
            <TabItem title={t('lecture.tabs.statistics')} icon={HiChartBar}>

            </TabItem>
        </Tabs>
    </div>
}
