import { serverTranslation } from '@/app/i18n'
import { Button, Card } from 'flowbite-react'
import { HiArrowRight } from 'react-icons/hi'
import { Trans } from 'react-i18next/TransWithoutContext'
import { requireUser } from '@/app/login/login-actions'
import { getMyOwnLatestLecture } from '@/app/lib/lecture-actions'
import If from '@/app/lib/If'
import LectureStatusIcon from '@/app/lib/lecture-icons'
import Link from 'next/link'
import { NextDueCard } from '@/app/studio/lectures/[id]/task-cards'
import { LectureStatus, LectureTasks } from '@prisma/client'

export default async function StudioHome() {
    const { t } = await serverTranslation('studio')

    const user = await requireUser()
    const lecture = await getMyOwnLatestLecture()

    return <div className="base-studio-page">
        <h1 className="mb-8">{t('nav.dashboard')}</h1>
        <h2 className="mb-5 font-normal">{t('dashboard.onboarding')}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-8">
            <If condition={lecture != null && lecture.status !== LectureStatus.completed}>
                <Card className="col-span-2">
                    <h2>{t('dashboard.continueCard.title')}</h2>
                    <p className="secondary xl:mb-6">{t('dashboard.continueCard.subtitle')}</p>
                    <Button as={Link} href={`/studio/lectures/${lecture?.id}`}>
                        {t('dashboard.continueCard.cta')}
                        <HiArrowRight className="btn-guide-icon"/>
                    </Button>
                </Card>
            </If>
            <If condition={lecture == null || lecture.status === LectureStatus.completed}>
                <Card className="col-span-2">
                    <h2>{t('dashboard.createCard.title')}</h2>
                    <p className="secondary xl:mb-6">{t('dashboard.createCard.subtitle')}</p>
                    <Button as={Link} href="/studio/lectures/create">
                        {t('dashboard.createCard.cta')}
                        <HiArrowRight className="btn-guide-icon"/>
                    </Button>
                </Card>
            </If>
            <Card className="col-span-1">
                <h2>{t('dashboard.tutorialCard.title')}</h2>
                <p className="secondary">{t('dashboard.tutorialCard.subtitle')}</p>
                <Button color="blue">
                    {t('dashboard.tutorialCard.cta')}
                    <HiArrowRight className="btn-guide-icon"/>
                </Button>
            </Card>
            <Card className="col-span-1 hidden 2xl:block">
                <h2>{t('dashboard.watchCard.title')}</h2>
                <p className="secondary">{t('dashboard.watchCard.subtitle')}</p>
                <Button color="warning">
                    {t('dashboard.watchCard.cta')}
                    <HiArrowRight className="btn-guide-icon"/>
                </Button>
            </Card>
        </div>

        <If condition={lecture != null}>
            <h2 className="mb-1 font-normal">{t('dashboard.latest.title')}</h2>
            <h3 className="mb-5 font-normal">{lecture?.title}</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-8">
                <Card>
                    <p className="secondary text-sm font-display">{t('lecture.dashboard.status')}</p>
                    <div className="flex flex-col w-full justify-center items-center">
                        <LectureStatusIcon status={lecture?.status ?? 'completed'}/>
                        <p className="mt-3">{t(`lectureStatus.${lecture?.status}.name`)}</p>
                    </div>
                    <Button color="blue" as={Link} href={`/studio/lectures/${lecture?.id}`}>
                        {t('dashboard.latest.viewDetails')}
                        <HiArrowRight className="btn-guide-icon"/>
                    </Button>
                </Card>
                <If condition={lecture != null && lecture.tasks.length > 0}>
                    <NextDueCard task={(lecture?.tasks ?? [
                        {
                            id: 1,
                            type: LectureTasks.confirmDate,
                            assigneeId: 0,
                            dueAt: new Date(),
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            completedAt: null,
                            lectureId: 0,
                            assignee: { id: 0, name: '', pinyin: '', permissions: [], phone: '' }
                        }
                    ]).toSorted((a, b) => {
                        const aIsNotAssigned = a.assigneeId !== user.id ? 1 : 0
                        const bIsNotAssigned = b.assigneeId !== user.id ? 1 : 0
                        if (aIsNotAssigned !== bIsNotAssigned) {
                            return aIsNotAssigned - bIsNotAssigned
                        }
                        const timeDiffA = a.dueAt.getTime() - new Date().getTime()
                        const timeDiffB = b.dueAt.getTime() - new Date().getTime()
                        return timeDiffA - timeDiffB
                    })[0]} tabsRef={null}/>
                </If>
                <If condition={lecture?.date != null && new Date().getTime() <= lecture?.date?.getTime()}>
                    <Card>
                        <p className="secondary text-sm font-display">{t('lecture.dashboard.countdown')}</p>
                        <div className="flex flex-col w-full justify-center items-center h-full">
                            <p className="text-7xl mb-3 font-display font-bold text-blue-500 dark:text-white">{Math.ceil(((lecture?.date?.getTime() ?? 0) - new Date().getTime()) / 1000 / 86400)}</p>
                            <p><Trans t={t} i18nKey="lecture.dashboard.days"
                                      count={Math.ceil(((lecture?.date?.getTime() ?? 0) - new Date().getTime()) / 1000 / 86400)}/>
                            </p>
                            <p className="secondary">{lecture?.date?.toLocaleDateString()}</p>
                        </div>
                    </Card>
                </If>
            </div>
        </If>
    </div>
}
