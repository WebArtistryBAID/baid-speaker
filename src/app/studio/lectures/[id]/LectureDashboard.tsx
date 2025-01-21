'use client'

import {
    changeDate,
    changeLocation,
    HydratedLecture,
    markCompleted,
    markCompletingPostTasks,
    markReady
} from '@/app/lib/lecture-actions'
import If from '@/app/lib/If'
import { LectureStatus } from '@prisma/client'
import {
    Button,
    Card,
    Datepicker,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    TabsRef,
    TextInput
} from 'flowbite-react'
import LectureStatusIcon from '@/app/lib/lecture-icons'
import { HiArrowRight } from 'react-icons/hi'
import { useTranslationClient } from '@/app/i18n/client'
import { NextDueCard } from '@/app/studio/lectures/[id]/task-cards'
import { useCachedUser } from '@/app/login/login-client'
import { Trans } from 'react-i18next/TransWithoutContext'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LectureDashboard({lecture, tabsRef}: { lecture: HydratedLecture, tabsRef: TabsRef }) {
    const {t} = useTranslationClient('studio')
    const user = useCachedUser()!

    const [ changeStatusModal, setChangeStatusModal ] = useState(false)
    const [ changeDateModal, setChangeDateModal ] = useState(false)
    const [ changeLocationModal, setChangeLocationModal ] = useState(false)
    const [ date, setDate ] = useState<Date | null>(null)
    const [ loc, setLoc ] = useState('')
    const [ locError, setLocError ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const router = useRouter()

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

        <Modal show={changeStatusModal} onClose={() => setChangeStatusModal(false)}>
            <ModalHeader>{t('lecture.dashboard.changeStatus')}</ModalHeader>
            <ModalBody>
                <div className="p-6 relative">
                    <p className="mb-3">{t('lecture.dashboard.changeStatusMessage')}</p>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button disabled={loading} onClick={async () => {
                    setLoading(true)
                    if (lecture.status === LectureStatus.completingPreTasks) {
                        await markReady(lecture.id)
                    } else if (lecture.status === LectureStatus.ready) {
                        await markCompletingPostTasks(lecture.id)
                    } else if (lecture.status === LectureStatus.completingPostTasks) {
                        await markCompleted(lecture.id)
                    }
                    setChangeStatusModal(false)
                    setLoading(false)
                    router.refresh()
                }}>
                    {t('confirm')}
                </Button>
                <Button color="gray" onClick={() => setChangeStatusModal(false)}>
                    {t('cancel')}
                </Button>
            </ModalFooter>
        </Modal>

        <Modal show={changeDateModal} size="xl" onClose={() => setChangeDateModal(false)}>
            <ModalHeader>{t('tasks.confirmDate.name')}</ModalHeader>
            <ModalBody>
                <div className="p-6 relative">
                    <p className="mb-3">{t('tasks.confirmDate.descriptionAssignee')}</p>
                    <div className="w-full flex justify-center items-center">
                        <Datepicker inline minDate={new Date()} value={date} onChange={e => setDate(e)} weekStart={1}/>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button disabled={loading} onClick={async () => {
                    if (date != null) {
                        setLoading(true)
                        await changeDate(lecture.id, date)
                        setLoading(false)
                        setChangeDateModal(false)
                        router.refresh()
                    }
                }}>{t('tasks.confirmDate.cta')}</Button>
                <Button color="gray" onClick={() => setChangeDateModal(false)}>
                    {t('cancel')}
                </Button>
            </ModalFooter>
        </Modal>

        <Modal show={changeLocationModal} size="xl" onClose={() => setChangeLocationModal(false)}>
            <ModalHeader>{t('tasks.confirmLocation.name')}</ModalHeader>
            <ModalBody>
                <div className="p-6 relative">
                    <p className="mb-3">{t('tasks.confirmLocation.descriptionAssignee')}</p>
                    <TextInput type="text" required
                               color={locError ? 'failure' : undefined}
                               value={loc} onChange={e => setLoc(e.currentTarget.value)}
                               helperText={locError ? t('tasks.confirmLocation.inputError') : null}/>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button disabled={loading} onClick={async () => {
                    setLocError(false)
                    if (loc.length < 1) {
                        setLocError(true)
                        return
                    }
                    setLoading(true)
                    await changeLocation(lecture.id, loc)
                    setLoading(false)
                    setChangeLocationModal(false)
                    router.refresh()
                }}>{t('tasks.confirmLocation.cta')}</Button>
                <Button color="gray" onClick={() => setChangeLocationModal(false)}>
                    {t('cancel')}
                </Button>
            </ModalFooter>
        </Modal>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-8">
            <Card>
                <p className="secondary text-sm font-display">{t('lecture.dashboard.status')}</p>
                <div className="flex flex-col w-full justify-center items-center">
                    <LectureStatusIcon status={lecture.status}/>
                    <p className="mt-3">{t(`lectureStatus.${lecture.status}.name`)}</p>
                </div>
                <p className="secondary text-sm">{t(`lectureStatus.${lecture.status}.details`)}</p>
                <If condition={user.permissions.includes('admin.manage') && (lecture.status === LectureStatus.completingPreTasks || lecture.status === LectureStatus.ready || lecture.status === LectureStatus.completingPostTasks)}>
                    <Button color="blue" className="mt-3" onClick={() => setChangeStatusModal(true)}>
                        {t('lecture.dashboard.changeStatus')}
                        <HiArrowRight className="btn-guide-icon"/>
                    </Button>
                </If>
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
                        <p className="text-3xl text-blue-500 dark:text-white font-bold">{lecture.assignee?.name}</p>
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
                        <p className="text-3xl text-blue-500 dark:text-white font-bold">{lecture.assigneeTeacher?.name}</p>
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
                        <If condition={user.permissions.includes('admin.manage') && lecture.status === LectureStatus.completingPreTasks}>
                            <Button color="blue" fullSized className="mt-3" onClick={() => setChangeDateModal(true)}>
                                {t('change')}
                                <HiArrowRight className="btn-guide-icon"/>
                            </Button>
                        </If>
                    </div>
                </Card>
            </If>
            <If condition={lecture.location != null}>
                <Card>
                    <p className="secondary text-sm font-display">{t('lecture.dashboard.location')}</p>
                    <div className="flex flex-col w-full justify-center items-center">
                        <p className="text-3xl font-bold text-blue-500 dark:text-white">{lecture.location}</p>
                    </div>
                    <p className="secondary text-sm">{t('lecture.dashboard.locationMessage')}</p>
                    <If condition={user.permissions.includes('admin.manage') && lecture.status === LectureStatus.completingPreTasks}>
                        <Button color="blue" fullSized className="mt-3" onClick={() => setChangeLocationModal(true)}>
                            {t('change')}
                            <HiArrowRight className="btn-guide-icon"/>
                        </Button>
                    </If>
                </Card>
            </If>
        </div>
    </>
}
