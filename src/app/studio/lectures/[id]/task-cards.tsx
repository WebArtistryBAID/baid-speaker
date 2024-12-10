'use client'

import {LectureTasks} from '@prisma/client'
import {ReactNode, useState} from 'react'
import {useCachedUser} from '@/app/login/login-client'
import {Button, Card, Datepicker, Modal, ModalBody, ModalFooter, ModalHeader, TabsRef, Tooltip} from 'flowbite-react'
import {useTranslationClient} from '@/app/i18n/client'
import If from '@/app/lib/If'
import {
    HiArrowRight,
    HiCalendar,
    HiCheck,
    HiClock,
    HiExclamation,
    HiLink,
    HiMicrophone,
    HiUser,
    HiUserGroup
} from 'react-icons/hi'
import {
    confirmDate,
    confirmNeedComPoster,
    HydratedLectureTask,
    inviteParticipants,
    sendAdvertisements,
    teacherApprovePresentation,
    testDevice
} from '@/app/lib/lecture-actions'
import {HiArrowUpTray, HiMapPin} from 'react-icons/hi2'
import {Trans} from 'react-i18next/TransWithoutContext'
import {useRouter} from 'next/navigation'

export default function TaskCard({task}: { task: HydratedLectureTask }) {
    switch (task.type) {
        case LectureTasks.confirmDate:
            return <ConfirmDateCard task={task}/>
        case LectureTasks.confirmNeedComPoster:
            return <ConfirmNeedComPosterCard task={task}/>
        case LectureTasks.confirmPosterDesigner:
            return <ConfirmPosterDesignerCard task={task}/>
        case LectureTasks.submitPoster:
            return <SubmitPosterCard task={task}/>
        case LectureTasks.inviteTeacher:
            return <InviteTeacherCard task={task}/>
        case LectureTasks.submitPresentation:
            return <SubmitPresentationCard task={task}/>
        case LectureTasks.teacherApprovePresentation:
            return <TeacherApprovePresentationCard task={task}/>
        case LectureTasks.schoolApprovePoster:
            return <SchoolApprovePosterCard task={task}/>
        case LectureTasks.confirmLocation:
            return <ConfirmLocationCard task={task}/>
        case LectureTasks.testDevice:
            return <TestDeviceCard task={task}/>
        case LectureTasks.createGroupChat:
            return <CreateGroupChatCard task={task}/>
        case LectureTasks.inviteParticipants:
            return <InviteParticipantsCard task={task}/>
        case LectureTasks.sendAdvertisements:
            return <SendAdvertisementsCard task={task}/>
        case LectureTasks.updateLiveAudience:
            return <UpdateLiveAudienceCard task={task}/>
        case LectureTasks.submitFeedback:
            return <SubmitFeedbackCard task={task}/>
        case LectureTasks.submitVideo:
            return <SubmitVideoCard task={task}/>
        case LectureTasks.submitReflection:
            return <SubmitReflectionCard task={task}/>
        default:
            return <div>Error</div>
    }
}

function getDueDays(task: HydratedLectureTask) {
    return Math.floor((task.dueAt.getTime() - new Date().getTime()) / 1000 / 86400)
}

export function NextDueCard({task, tabsRef}: { task: HydratedLectureTask, tabsRef: TabsRef }) {
    const {t} = useTranslationClient('studio')
    return <Card className="col-span-2">
        <p className="secondary text-sm font-display">{t('lecture.tasks.nextDue.title')}</p>
        <p className="text-3xl font-display">
            <If condition={getDueDays(task) > 0}>
                <Trans t={t} i18nKey="lecture.tasks.nextDue.template"
                       values={{
                           action: t(`tasks.${task.type}.smallName`)
                       }}
                       count={getDueDays(task)}
                       components={{
                           1: <span className="font-bold text-blue-500" key={161}/>
                       }}/>
            </If>
            <If condition={getDueDays(task) === 0}>
                <Trans t={t} i18nKey="lecture.tasks.nextDue.template_today"
                       values={{
                           action: t(`tasks.${task.type}.smallName`)
                       }}
                       components={{
                           1: <span className="font-bold text-blue-500" key={171}/>
                       }}/>
            </If>
            <If condition={getDueDays(task) < 0}>
                <Trans t={t} i18nKey="lecture.tasks.nextDue.templateOverdue"
                       values={{
                           action: t(`tasks.${task.type}.smallName`)
                       }}
                       count={-getDueDays(task)}
                       components={{
                           1: <span className="font-bold text-red-500" key={181}/>
                       }}/>
            </If>
        </p>
        <Button onClick={() => tabsRef.setActiveTab(1)} color={getDueDays(task) < 0 ? 'failure' : 'blue'}>
            {t('lecture.tasks.nextDue.cta')}
            <HiArrowRight className="btn-guide-icon"/>
        </Button>
    </Card>
}

export function BaseCard({task, children}: { task: HydratedLectureTask, children: ReactNode }) {
    const {t} = useTranslationClient('studio')
    const user = useCachedUser()
    return <Card className="h-full w-full">
        <h2>{t(`tasks.${task.type}.name`)}</h2>
        <p className="secondary">{t(task.assigneeId === user.id ?
            `tasks.${task.type}.descriptionAssignee` : `tasks.${task.type}.descriptionUser`)}</p>
        <div className="flex items-center">
            <div className="flex justify-center items-center w-8 h-8 mr-3 bg-blue-500 rounded-full">
                <HiUser className="text-white"/>
            </div>
            <p><Trans t={t} i18nKey="assignedTo" values={{name: task.assignee.name}}
                      components={{1: <span className="font-bold" key={1919810}/>}}/></p>
        </div>
        <Tooltip content={task.dueAt.toLocaleDateString()}>
            <div className="flex items-center mb-3">
                <If condition={getDueDays(task) > 0}>
                    <div className="flex justify-center items-center w-8 h-8 mr-3 bg-blue-500 rounded-full">
                        <HiClock className="text-white"/>
                    </div>
                    <p><Trans t={t} i18nKey="dueIn" count={getDueDays(task)}
                              components={{1: <span className="font-bold" key={188}/>}}/></p>
                </If>
                <If condition={getDueDays(task) === 0}>
                    <div className="flex justify-center items-center w-8 h-8 mr-3 bg-blue-500 rounded-full">
                        <HiClock className="text-white"/>
                    </div>
                    <p>{t('dueToday')}</p>
                </If>
                <If condition={getDueDays(task) < 0}>
                    <div className="flex justify-center items-center w-8 h-8 mr-3 bg-red-500 rounded-full">
                        <HiExclamation className="text-white"/>
                    </div>
                    <p><Trans t={t} i18nKey="overdue" count={-getDueDays(task)}
                              components={{1: <span className="font-bold" key={114514}/>}}/></p>
                </If>
            </div>
        </Tooltip>
        <If condition={task.assigneeId === user.id}>
            {children}
        </If>
    </Card>
}

export function ConfirmDateCard({task}: { task: HydratedLectureTask }) {
    const {t} = useTranslationClient('studio')
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Date | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    return <BaseCard task={task}>
        <Button color="blue" onClick={() => setOpen(true)} fullSized><HiCalendar
            className="btn-icon"/>{t('tasks.confirmDate.cta')}</Button>
        <Modal show={open} size="xl" onClose={() => setOpen(false)}>
            <ModalHeader>{t('tasks.confirmDate.name')}</ModalHeader>
            <ModalBody>
                <div className="p-6 relative">
                    <p className="secondary mb-3">{t('tasks.confirmDate.descriptionAssignee')}</p>
                    <div className="w-full flex justify-center items-center">
                        <Datepicker inline value={date} onChange={e => setDate(e)} weekStart={1}/>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button disabled={loading} onClick={async () => {
                    if (date != null) {
                        setLoading(true)
                        await confirmDate(task.lectureId, task, date)
                        router.refresh()
                    }
                }}>{t('tasks.confirmDate.cta')}</Button>
                <Button color="gray" onClick={() => setOpen(false)}>
                    {t('cancel')}
                </Button>
            </ModalFooter>
        </Modal>
    </BaseCard>
}

export function ConfirmNeedComPosterCard({task}: { task: HydratedLectureTask }) {
    const {t} = useTranslationClient('studio')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    return <BaseCard task={task}>
        <Button disabled={loading} color="blue" fullSized onClick={async () => {
            setLoading(true)
            await confirmNeedComPoster(task.lectureId, task, true)
            router.refresh()
        }}>{t('tasks.confirmNeedComPoster.cta1')}</Button>
        <Button disabled={loading} color="blue" fullSized onClick={async () => {
            setLoading(true)
            await confirmNeedComPoster(task.lectureId, task, false)
            router.refresh()
        }}>{t('tasks.confirmNeedComPoster.cta2')}</Button>
    </BaseCard>
}

export function ConfirmPosterDesignerCard({task}: { task: HydratedLectureTask }) {
    // TODO
    const {t} = useTranslationClient('studio')
    return <BaseCard task={task}>
        <Button color="blue" fullSized><HiLink className="btn-icon"/>{t('tasks.confirmPosterDesigner.cta')}</Button>
    </BaseCard>
}

export function SubmitPosterCard({task}: { task: HydratedLectureTask }) {
    // TODO
    const {t} = useTranslationClient('studio')
    return <BaseCard task={task}>
        <Button color="blue" fullSized><HiArrowUpTray className="btn-icon"/>{t('tasks.submitPoster.cta')}</Button>
    </BaseCard>
}

export function InviteTeacherCard({task}: { task: HydratedLectureTask }) {
    // TODO
    const {t} = useTranslationClient('studio')
    return <BaseCard task={task}>
        <Button color="blue" fullSized><HiLink className="btn-icon"/>{t('tasks.inviteTeacher.cta')}</Button>
    </BaseCard>
}

export function SubmitPresentationCard({task}: { task: HydratedLectureTask }) {
    // TODO
    const {t} = useTranslationClient('studio')
    return <BaseCard task={task}>
        <Button color="blue" fullSized><HiArrowUpTray className="btn-icon"/>{t('tasks.submitPresentation.cta')}</Button>
    </BaseCard>
}

export function TeacherApprovePresentationCard({task}: { task: HydratedLectureTask }) {
    const {t} = useTranslationClient('studio')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    return <BaseCard task={task}>
        <Button color="blue" disabled={loading}
                onClick={async () => {
                    setLoading(true)
                    await teacherApprovePresentation(task.lectureId, task)
                    router.refresh()
                }}
                fullSized><HiArrowRight className="btn-icon"/>{t('tasks.teacherApprovePresentation.cta')}
        </Button>
    </BaseCard>
}

export function SchoolApprovePosterCard({task}: { task: HydratedLectureTask }) {
    // TODO
    const {t} = useTranslationClient('studio')
    return <BaseCard task={task}>
        <Button color="blue" fullSized><HiLink className="btn-icon"/>{t('tasks.schoolApprovePoster.cta')}</Button>
    </BaseCard>
}

export function ConfirmLocationCard({task}: { task: HydratedLectureTask }) {
    // TODO
    const {t} = useTranslationClient('studio')
    return <BaseCard task={task}>
        <Button color="blue" fullSized><HiMapPin className="btn-icon"/>{t('tasks.confirmLocation.cta')}</Button>
    </BaseCard>
}

export function TestDeviceCard({task}: { task: HydratedLectureTask }) {
    // TODO
    const {t} = useTranslationClient('studio')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    return <BaseCard task={task}>
        <Button color="blue" fullSized disabled={loading} onClick={async () => {
            setLoading(true)
            await testDevice(task.lectureId, task)
            router.refresh()
        }}><HiMicrophone className="btn-icon"/>{t('tasks.testDevice.cta')}</Button>
    </BaseCard>
}

export function CreateGroupChatCard({task}: { task: HydratedLectureTask }) {
    // TODO
    const {t} = useTranslationClient('studio')
    return <BaseCard task={task}>
        <Button color="blue" fullSized><HiArrowUpTray className="btn-icon"/>{t('tasks.createGroupChat.cta')}</Button>
    </BaseCard>
}

export function InviteParticipantsCard({task}: { task: HydratedLectureTask }) {
    const {t} = useTranslationClient('studio')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    return <BaseCard task={task}>
        <Button color="blue" fullSized disabled={loading} onClick={async () => {
            setLoading(true)
            await inviteParticipants(task.lectureId, task)
            router.refresh()
        }}><HiCheck className="btn-icon"/>{t('tasks.inviteParticipants.cta')}</Button>
    </BaseCard>
}

export function SendAdvertisementsCard({task}: { task: HydratedLectureTask }) {
    const {t} = useTranslationClient('studio')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    return <BaseCard task={task}>
        <Button color="blue" fullSized disabled={loading} onClick={async () => {
            setLoading(true)
            await sendAdvertisements(task.lectureId, task)
            router.refresh()
        }}><HiCheck className="btn-icon"/>{t('tasks.sendAdvertisements.cta')}</Button>
    </BaseCard>
}

export function UpdateLiveAudienceCard({task}: { task: HydratedLectureTask }) {
    const {t} = useTranslationClient('studio')
    return <BaseCard task={task}>
        <Button color="blue" fullSized><HiUserGroup className="btn-icon"/>{t('tasks.updateLiveAudience.cta')}</Button>
    </BaseCard>
}

export function SubmitFeedbackCard({task}: { task: HydratedLectureTask }) {
    const {t} = useTranslationClient('studio')
    return <BaseCard task={task}>
        <Button color="blue" fullSized><HiArrowUpTray className="btn-icon"/>{t('tasks.submitFeedback.cta')}</Button>
    </BaseCard>
}

export function SubmitVideoCard({task}: { task: HydratedLectureTask }) {
    const {t} = useTranslationClient('studio')
    return <BaseCard task={task}>
        <Button color="blue" fullSized><HiArrowUpTray className="btn-icon"/>{t('tasks.submitVideo.cta')}</Button>
    </BaseCard>
}

export function SubmitReflectionCard({task}: { task: HydratedLectureTask }) {
    const {t} = useTranslationClient('studio')
    return <BaseCard task={task}>
        <Button color="blue" fullSized><HiArrowUpTray className="btn-icon"/>{t('tasks.submitReflection.cta')}</Button>
    </BaseCard>
}
