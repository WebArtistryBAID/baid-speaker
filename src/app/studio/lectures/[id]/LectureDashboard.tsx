'use client'

import {HydratedLecture} from '@/app/lib/lecture-actions'
import If from '@/app/lib/If'
import {LectureStatus} from '@prisma/client'
import {Button, Card, TabsRef} from 'flowbite-react'
import LectureStatusIcon from '@/app/lib/LectureStatusIcon'
import {HiArrowRight} from 'react-icons/hi'
import {useTranslationClient} from '@/app/i18n/client'
import {NextDueCard} from '@/app/studio/lectures/[id]/task-cards'
import {useCachedUser} from '@/app/login/login-client'
import {Trans} from 'react-i18next/TransWithoutContext'

export default function LectureDashboard({lecture, tabsRef}: { lecture: HydratedLecture, tabsRef: TabsRef }) {
    const {t} = useTranslationClient('studio')
    const user = useCachedUser()

    return <>
        <div className="mb-5">
            <If condition={lecture.status === LectureStatus.waiting || lecture.status === LectureStatus.completingPreTasks}>
                <p>{t('lecture.dashboard.message')}</p>
            </If>
            <If condition={lecture.status === LectureStatus.ready}>
                <p>{t('lecture.dashboard.messageReady')}</p>
            </If>
            <If condition={lecture.status === LectureStatus.completingPostTasks || lecture.status === LectureStatus.completed}>
                <p>{t('lecture.dashboard.messagePost')}</p>
            </If>
        </div>

        <h2 className="mb-3">{t('lecture.dashboard.basic')}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-8">
            <Card>
                <p className="secondary text-sm font-display">{t('lecture.dashboard.status')}</p>
                <div className="flex flex-col w-full justify-center items-center">
                    <LectureStatusIcon status={lecture.status}/>
                    <p className="mt-3">{t(`lectureStatus.${lecture.status}.name`)}</p>
                </div>
                <p className="secondary text-sm">{t(`lectureStatus.${lecture.status}.details`)}</p>
            </Card>
            <If condition={lecture.tasks.length > 0}>
                <Card>
                    <p className="secondary text-sm font-display">{t('lecture.dashboard.tasks')}</p>
                    <div className="flex flex-col w-full justify-center items-center h-full">
                        <p className="text-7xl mb-3 font-display font-bold text-blue-500 dark:text-white">{lecture.tasks.length}</p>
                        <p><Trans t={t} i18nKey="lecture.dashboard.tasksSub" count={lecture.tasks.length}/></p>
                    </div>
                    <Button color="blue" onClick={() => tabsRef.setActiveTab(1)}>
                        {t('lecture.dashboard.tasksCta')}
                        <HiArrowRight className="btn-guide-icon"/>
                    </Button>
                </Card>
            </If>
            <If condition={lecture.assigneeId != null}>
                <Card>
                    <p className="secondary text-sm font-display">{t('lecture.dashboard.host')}</p>
                    <div className="flex flex-col w-full justify-center items-center">
                        <p className="text-3xl text-blue-500 font-bold">{lecture.assignee?.name}</p>
                    </div>
                    <p className="secondary text-sm">{t('lecture.dashboard.hostMessage')}</p>
                    <Button color="blue" onClick={() => tabsRef.setActiveTab(2)}>
                        {t('lecture.dashboard.contact')}
                        <HiArrowRight className="btn-guide-icon"/>
                    </Button>
                </Card>
            </If>
            <If condition={lecture.assigneeTeacherId != null}>
                <Card>
                    <p className="secondary text-sm font-display">{t('lecture.dashboard.teacher')}</p>
                    <div className="flex flex-col w-full justify-center items-center">
                        <p className="text-3xl text-blue-500 font-bold">{lecture.assigneeTeacher?.name}</p>
                    </div>
                    <p className="secondary text-sm">{t('lecture.dashboard.teacherMessage')}</p>
                    <Button color="blue" onClick={() => tabsRef.setActiveTab(2)}>
                        {t('lecture.dashboard.contact')}
                        <HiArrowRight className="btn-guide-icon"/>
                    </Button>
                </Card>
            </If>
            <If condition={lecture.tasks.length > 0}>
                <NextDueCard task={lecture.tasks.toSorted((a, b) => {
                    const aIsNotAssigned = a.assigneeId !== user.id ? 1 : 0
                    const bIsNotAssigned = b.assigneeId !== user.id ? 1 : 0
                    if (aIsNotAssigned !== bIsNotAssigned) {
                        return aIsNotAssigned - bIsNotAssigned
                    }
                    const timeDiffA = a.dueAt.getTime() - new Date().getTime()
                    const timeDiffB = b.dueAt.getTime() - new Date().getTime()
                    return timeDiffA - timeDiffB
                })[0]} tabsRef={tabsRef}/>
            </If>
            <If condition={lecture.date != null && new Date().getTime() <= lecture.date?.getTime()}>
                <Card>
                    <p className="secondary text-sm font-display">{t('lecture.dashboard.countdown')}</p>
                    <div className="flex flex-col w-full justify-center items-center h-full">
                        <p className="text-7xl mb-3 font-display font-bold text-blue-500 dark:text-white">{Math.ceil(((lecture.date?.getTime() ?? 0) - new Date().getTime()) / 1000 / 86400)}</p>
                        <p><Trans t={t} i18nKey="lecture.dashboard.days"
                                  count={Math.ceil(((lecture.date?.getTime() ?? 0) - new Date().getTime()) / 1000 / 86400)}/>
                        </p>
                        <p className="secondary">{lecture.date?.toLocaleDateString()}</p>
                    </div>
                </Card>
            </If>
        </div>
    </>
}
