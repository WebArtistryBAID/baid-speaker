'use client'

import { LectureStatus } from '@prisma/client'
import { useTranslationClient } from '@/app/i18n/client'
import { Card, TabItem, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Tabs } from 'flowbite-react'
import { HiCalendar, HiChartPie, HiDocumentText, HiInbox, HiRefresh, HiUsers } from 'react-icons/hi'
import If from '@/app/lib/If'
import LectureStatusIcon from '@/app/lib/LectureStatusIcon'
import { HydratedLecture } from '@/app/lib/lecture-actions'

export default function StudioLecture({ lecture }: { lecture: HydratedLecture }) {
    const { t } = useTranslationClient('studio')
    return <div className="base-studio-page">
        <h1 className="mb-3">{lecture.title}</h1>
        <p className="text-xl mb-5 secondary">{lecture.user.name}</p>
        <Tabs aria-label={t('lecture.tabs.title')} variant="underline">
            <TabItem active title={t('lecture.tabs.dashboard')} icon={HiChartPie}>
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

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <p className="secondary text-sm font-display">{t('lecture.dashboard.status')}</p>
                        <div className="flex flex-col w-full justify-center items-center">
                            <LectureStatusIcon status={lecture.status}/>
                            <p>{t(`lectureStatus.${lecture.status}.name`)}</p>
                        </div>
                        <p className="secondary text-sm">{t(`lectureStatus.${lecture.status}.details`)}</p>
                    </Card>
                </div>
            </TabItem>
            <TabItem title={t('lecture.tabs.tasks')} icon={HiCalendar}>
                <If condition={lecture.tasks.length < 1}>
                    <div className="w-full flex flex-col justify-center items-center">
                        <HiInbox className="text-7xl mb-3 secondary"/>
                        <p>{t('lecture.tasks.empty')}</p>
                    </div>
                </If>
            </TabItem>
            <TabItem title={t('lecture.tabs.users')} icon={HiUsers}>
                <p className="mb-3">{t('lecture.people.message')}</p>
                <Table>
                    <TableHead>
                        <TableHeadCell>{t('lecture.people.name')}</TableHeadCell>
                        <TableHeadCell>{t('lecture.people.phone')}</TableHeadCell>
                        <TableHeadCell>{t('lecture.people.role')}</TableHeadCell>
                    </TableHead>
                    <TableBody className="divide-y">
                        <TableRow className="tr">
                            <TableCell className="th">{lecture.user.name}</TableCell>
                            <TableCell>{lecture.user.phone}</TableCell>
                            <TableCell>{t('lecture.people.speaker')}</TableCell>
                        </TableRow>
                        <If condition={lecture.assigneeId != null}>
                            <TableRow className="tr">
                                <TableCell className="th">{lecture.assignee?.name}</TableCell>
                                <TableCell>{lecture.assignee?.phone}</TableCell>
                                <TableCell>{t('lecture.people.host')}</TableCell>
                            </TableRow>
                        </If>
                        <If condition={lecture.assigneeTeacherId != null}>
                            <TableRow className="tr">
                                <TableCell className="th">{lecture.assigneeTeacher?.name}</TableCell>
                                <TableCell>{lecture.assigneeTeacher?.phone}</TableCell>
                                <TableCell>{t('lecture.people.teacher')}</TableCell>
                            </TableRow>
                        </If>
                        <If condition={lecture.posterAssigneeId != null}>
                            <TableRow className="tr">
                                <TableCell className="th">{lecture.posterAssignee?.name}</TableCell>
                                <TableCell>{lecture.posterAssignee?.phone}</TableCell>
                                <TableCell>{t('lecture.people.poster')}</TableCell>
                            </TableRow>
                        </If>
                        <TableRow className="tr">
                            <TableCell className="th">{t('lecture.people.other')}</TableCell>
                            <TableCell className="th"></TableCell>
                            <TableCell className="th"></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TabItem>
            <TabItem title={t('lecture.tabs.history')} icon={HiRefresh}>

            </TabItem>
            <TabItem title={t('lecture.tabs.content')} icon={HiDocumentText}>

            </TabItem>
        </Tabs>
    </div>
}
