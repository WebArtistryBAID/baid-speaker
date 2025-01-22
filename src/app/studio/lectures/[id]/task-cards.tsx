'use client'

import { LectureTasks } from '@prisma/client'
import { ReactNode, useRef, useState } from 'react'
import { useCachedUser } from '@/app/login/login-client'
import {
    Button,
    Card,
    Datepicker,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    TabsRef,
    TextInput,
    Tooltip
} from 'flowbite-react'
import { useTranslationClient } from '@/app/i18n/client'
import If from '@/app/lib/If'
import { HiArrowRight, HiCalendar, HiCheck, HiClock, HiExclamation, HiLink, HiMicrophone, HiUser } from 'react-icons/hi'
import {
    confirmDate,
    confirmLocation,
    confirmNeedComPoster,
    HydratedLectureTask,
    inviteParticipants,
    sendAdvertisements,
    submitReflection,
    submitVideo,
    testDevice,
    updateLiveAudience
} from '@/app/lib/lecture-actions'
import { HiArrowUpTray, HiMapPin } from 'react-icons/hi2'
import { Trans } from 'react-i18next/TransWithoutContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function TaskCard({ task }: { task: HydratedLectureTask }) {
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
            return <div>Wait, that's impossible...</div>
    }
}

function getDueDays(task: HydratedLectureTask) {
    return Math.ceil((task.dueAt.getTime() - new Date().getTime()) / 1000 / 86400)
}

export function NextDueCard({ task, tabsRef }: { task: HydratedLectureTask, tabsRef: TabsRef | null }) {
    const { t } = useTranslationClient('studio')
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
        <If condition={tabsRef == null}>
            <Button color="blue" as={Link} href={`/studio/lectures/${task.lectureId}`}>
                {t('dashboard.latest.viewDetails')}
                <HiArrowRight className="btn-guide-icon"/>
            </Button>
        </If>
        <If condition={tabsRef != null}>
            <Button onClick={() => tabsRef!.setActiveTab(1)} color={getDueDays(task) < 0 ? 'failure' : 'blue'}>
                {t('lecture.tasks.nextDue.cta')}
                <HiArrowRight className="btn-guide-icon"/>
            </Button>
        </If>
    </Card>
}

export function BaseCard({ task, children }: { task: HydratedLectureTask, children: ReactNode }) {
    const { t } = useTranslationClient('studio')
    const user = useCachedUser()!
    return <Card className="h-full w-full">
        <h2>{t(`tasks.${task.type}.name`)}</h2>
        <p className="secondary">{t(task.assigneeId === user.id ?
            `tasks.${task.type}.descriptionAssignee` : `tasks.${task.type}.descriptionUser`)}</p>
        <div className="flex items-center">
            <div className="flex justify-center items-center w-8 h-8 mr-3 bg-blue-500 rounded-full">
                <HiUser className="text-white"/>
            </div>
            <p><Trans t={t} i18nKey="assignedTo" values={{ name: task.assignee.name }}
                      components={{ 1: <span className="font-bold" key={1919810}/> }}/></p>
        </div>
        <Tooltip content={task.dueAt.toLocaleDateString()}>
            <div className="flex items-center mb-3">
                <If condition={getDueDays(task) > 0}>
                    <div className="flex justify-center items-center w-8 h-8 mr-3 bg-blue-500 rounded-full">
                        <HiClock className="text-white"/>
                    </div>
                    <p><Trans t={t} i18nKey="dueIn" count={getDueDays(task)}
                              components={{ 1: <span className="font-bold" key={188}/> }}/></p>
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
                              components={{ 1: <span className="font-bold" key={114514}/> }}/></p>
                </If>
            </div>
        </Tooltip>
        <If condition={task.assigneeId === user.id}>
            {children}
        </If>
        <If condition={task.assigneeId !== user.id}>
            <Button disabled={true} color="blue">
                {t('tasks.ctaBad')}
            </Button>
        </If>
    </Card>
}

export function ConfirmDateCard({ task }: { task: HydratedLectureTask }) {
    const { t } = useTranslationClient('studio')
    const [ open, setOpen ] = useState(false)
    const [ date, setDate ] = useState<Date | null>(null)
    const [ loading, setLoading ] = useState(false)
    const router = useRouter()
    return <BaseCard task={task}>
        <Button color="blue" onClick={() => setOpen(true)} fullSized><HiCalendar
            className="btn-icon"/>{t('tasks.confirmDate.cta')}</Button>
        <Modal show={open} size="xl" onClose={() => setOpen(false)}>
            <ModalHeader>{t('tasks.confirmDate.name')}</ModalHeader>
            <ModalBody>
                <p className="mb-3">{t('tasks.confirmDate.descriptionAssignee')}</p>
                <div className="w-full flex justify-center items-center">
                    <Datepicker inline minDate={new Date()} value={date} onChange={e => setDate(e)} weekStart={1}/>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="blue" disabled={loading} onClick={async () => {
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

export function ConfirmNeedComPosterCard({ task }: { task: HydratedLectureTask }) {
    const { t } = useTranslationClient('studio')
    const [ loading, setLoading ] = useState(false)
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

export function ConfirmPosterDesignerCard({ task }: { task: HydratedLectureTask }) {
    const { t } = useTranslationClient('studio')
    const [ copied, setCopied ] = useState(false)
    return <BaseCard task={task}>
        <Button color="blue" fullSized onClick={async () => {
            await navigator.clipboard.writeText(`${location.origin}/invitations/${task.lectureId}/artist`)
            setCopied(true)
            setTimeout(() => {
                setCopied(false)
            }, 3000)
        }}>
            <HiLink className="btn-icon"/>{t(copied ? 'copied' : 'tasks.confirmPosterDesigner.cta')}
        </Button>
    </BaseCard>
}

export function SubmitPosterCard({ task }: { task: HydratedLectureTask }) {
    const { t } = useTranslationClient('studio')
    const [ loading, setLoading ] = useState(false)
    const [ complete, setComplete ] = useState(false)
    const [ progress, setProgress ] = useState(0)
    const [ error, setError ] = useState(false)

    function upload() {
        const formData = new FormData()
        formData.append('file', ref.current!.files![0])
        formData.append('target', 'poster')

        setLoading(true)
        const xhr = new XMLHttpRequest()
        xhr.open('POST', `/studio/lectures/${task.lectureId}/upload`, true)
        xhr.upload.onprogress = (e: ProgressEvent) => {
            if (e.lengthComputable) {
                setProgress(Math.round((e.loaded / e.total) * 100))
            }
        }
        xhr.onload = () => {
            setLoading(false)
            setProgress(0)
            if (xhr.status === 200) {
                setComplete(true)
            } else {
                setError(true)
            }
        }
        xhr.onerror = () => {
            setError(true)
        }

        xhr.send(formData)
    }

    const ref = useRef<HTMLInputElement | null>(null)
    return <BaseCard task={task}>
        <input type="file" onChange={upload} accept="image/*" className="hidden" ref={ref}/>
        <p className="font-bold">{t('uploadMessage')}</p>
        <Button color="blue" fullSized disabled={loading || complete} onClick={() => {
            ref.current?.click()
        }}>
            <HiArrowUpTray className="btn-icon"/>
            <If condition={loading}>
                {progress}%
            </If>
            <If condition={complete}>
                {t('done')}
            </If>
            <If condition={error}>
                {t('tryAgain')}
            </If>
            <If condition={!loading && !complete && !error}>
                {t('tasks.submitPoster.cta')}
            </If>
        </Button>
    </BaseCard>
}

export function InviteTeacherCard({ task }: { task: HydratedLectureTask }) {
    const { t } = useTranslationClient('studio')
    const [ copied, setCopied ] = useState(false)
    return <BaseCard task={task}>
        <Button color="blue" fullSized onClick={async () => {
            await navigator.clipboard.writeText(`${location.origin}/invitations/${task.lectureId}/teacher`)
            setCopied(true)
            setTimeout(() => {
                setCopied(false)
            }, 3000)
        }}>
            <HiLink className="btn-icon"/>{t(copied ? 'copied' : 'tasks.inviteTeacher.cta')}
        </Button>
    </BaseCard>
}

export function SubmitPresentationCard({ task }: { task: HydratedLectureTask }) {
    const { t } = useTranslationClient('studio')
    const [ loading, setLoading ] = useState(false)
    const [ complete, setComplete ] = useState(false)
    const [ progress, setProgress ] = useState(0)
    const [ error, setError ] = useState(false)

    function upload() {
        const formData = new FormData()
        formData.append('file', ref.current!.files![0])
        formData.append('target', 'slides')

        setLoading(true)
        const xhr = new XMLHttpRequest()
        xhr.open('POST', `/studio/lectures/${task.lectureId}/upload`, true)
        xhr.upload.onprogress = (e: ProgressEvent) => {
            if (e.lengthComputable) {
                setProgress(Math.round((e.loaded / e.total) * 100))
            }
        }
        xhr.onload = () => {
            setLoading(false)
            setProgress(0)
            if (xhr.status === 200) {
                setComplete(true)
            } else {
                setError(true)
            }
        }
        xhr.onerror = () => {
            setError(true)
        }

        xhr.send(formData)
    }

    const ref = useRef<HTMLInputElement | null>(null)
    return <BaseCard task={task}>
        <input type="file" onChange={upload}
               accept="application/x-iwork-keynote-sffkey,application/pdf,application/vnd.ms-powerpoint,text/plain,text/html,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint.presentation.macroEnabled.12,application/vnd.openxmlformats-officedocument.presentationml.slideshow,application/vnd.ms-pps"
               className="hidden" ref={ref}/>
        <p className="font-bold">{t('uploadMessage')}</p>
        <Button color="blue" fullSized disabled={loading || complete} onClick={() => {
            ref.current?.click()
        }}>
            <HiArrowUpTray className="btn-icon"/>
            <If condition={loading}>
                {progress}%
            </If>
            <If condition={complete}>
                {t('done')}
            </If>
            <If condition={error}>
                {t('tryAgain')}
            </If>
            <If condition={!loading && !complete && !error}>
                {t('tasks.submitPresentation.cta')}
            </If>
        </Button>
    </BaseCard>
}

export function TeacherApprovePresentationCard({ task }: { task: HydratedLectureTask }) {
    const { t } = useTranslationClient('studio')
    const [ copied, setCopied ] = useState(false)
    return <BaseCard task={task}>
        <Button color="blue" fullSized onClick={async () => {
            await navigator.clipboard.writeText(`${location.origin}/invitations/${task.lectureId}/slides`)
            setCopied(true)
            setTimeout(() => {
                setCopied(false)
            }, 3000)
        }}>
            <HiLink className="btn-icon"/>{t(copied ? 'copied' : 'tasks.teacherApprovePresentation.cta')}
        </Button>
    </BaseCard>
}

export function SchoolApprovePosterCard({ task }: { task: HydratedLectureTask }) {
    const { t } = useTranslationClient('studio')
    const [ copied, setCopied ] = useState(false)
    return <BaseCard task={task}>
        <Button color="blue" fullSized onClick={async () => {
            await navigator.clipboard.writeText(`${location.origin}/invitations/${task.lectureId}/poster`)
            setCopied(true)
            setTimeout(() => {
                setCopied(false)
            }, 3000)
        }}>
            <HiLink className="btn-icon"/>{t(copied ? 'copied' : 'tasks.schoolApprovePoster.cta')}
        </Button>
    </BaseCard>
}

export function ConfirmLocationCard({ task }: { task: HydratedLectureTask }) {
    const { t } = useTranslationClient('studio')
    const [ open, setOpen ] = useState(false)
    const [ location, setLocation ] = useState('')
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState(false)
    const router = useRouter()
    return <BaseCard task={task}>
        <Button color="blue" onClick={() => setOpen(true)} fullSized><HiMapPin
            className="btn-icon"/>{t('tasks.confirmLocation.cta')}</Button>
        <Modal show={open} onClose={() => setOpen(false)}>
            <ModalHeader>{t('tasks.confirmLocation.name')}</ModalHeader>
            <ModalBody>
                <p className="mb-3">{t('tasks.confirmLocation.descriptionAssignee')}</p>
                <TextInput type="text" required
                           color={error ? 'failure' : undefined}
                           value={location} onChange={e => setLocation(e.currentTarget.value)}
                           helperText={error ? t('tasks.confirmLocation.inputError') : null}/>
            </ModalBody>
            <ModalFooter>
                <Button color="blue" disabled={loading} onClick={async () => {
                    setError(false)
                    if (location.length < 1) {
                        setError(true)
                        return
                    }

                    setLoading(true)
                    await confirmLocation(task.lectureId, task, location)
                    router.refresh()
                }}>
                    {t('tasks.confirmLocation.cta')}
                </Button>
                <Button color="gray" onClick={() => setOpen(false)}>
                    {t('cancel')}
                </Button>
            </ModalFooter>
        </Modal>
    </BaseCard>
}

export function TestDeviceCard({ task }: { task: HydratedLectureTask }) {
    const { t } = useTranslationClient('studio')
    const [ loading, setLoading ] = useState(false)
    const router = useRouter()
    return <BaseCard task={task}>
        <Button color="blue" fullSized disabled={loading} onClick={async () => {
            setLoading(true)
            await testDevice(task.lectureId, task)
            router.refresh()
        }}><HiMicrophone className="btn-icon"/>{t('tasks.testDevice.cta')}</Button>
    </BaseCard>
}

export function CreateGroupChatCard({ task }: { task: HydratedLectureTask }) {
    const { t } = useTranslationClient('studio')
    const [ loading, setLoading ] = useState(false)
    const [ complete, setComplete ] = useState(false)
    const [ progress, setProgress ] = useState(0)
    const [ error, setError ] = useState(false)

    function upload() {
        const formData = new FormData()
        formData.append('file', ref.current!.files![0])
        formData.append('target', 'groupQR')

        setLoading(true)
        const xhr = new XMLHttpRequest()
        xhr.open('POST', `/studio/lectures/${task.lectureId}/upload`, true)
        xhr.upload.onprogress = (e: ProgressEvent) => {
            if (e.lengthComputable) {
                setProgress(Math.round((e.loaded / e.total) * 100))
            }
        }
        xhr.onload = () => {
            setLoading(false)
            setProgress(0)
            if (xhr.status === 200) {
                setComplete(true)
            } else {
                setError(true)
            }
        }
        xhr.onerror = () => {
            setError(true)
        }

        xhr.send(formData)
    }

    const ref = useRef<HTMLInputElement | null>(null)
    return <BaseCard task={task}>
        <input type="file" onChange={upload}
               accept="image/*"
               className="hidden" ref={ref}/>
        <p className="font-bold">{t('uploadMessage')}</p>
        <Button color="blue" fullSized disabled={loading || complete} onClick={() => {
            ref.current?.click()
        }}>
            <HiArrowUpTray className="btn-icon"/>
            <If condition={loading}>
                {progress}%
            </If>
            <If condition={complete}>
                {t('done')}
            </If>
            <If condition={error}>
                {t('tryAgain')}
            </If>
            <If condition={!loading && !complete && !error}>
                {t('tasks.createGroupChat.cta')}
            </If>
        </Button>
    </BaseCard>
}

export function InviteParticipantsCard({ task }: { task: HydratedLectureTask }) {
    const { t } = useTranslationClient('studio')
    const [ loading, setLoading ] = useState(false)
    const router = useRouter()
    return <BaseCard task={task}>
        <Button color="blue" fullSized disabled={loading} onClick={async () => {
            setLoading(true)
            await inviteParticipants(task.lectureId, task)
            router.refresh()
        }}><HiCheck className="btn-icon"/>{t('tasks.inviteParticipants.cta')}</Button>
    </BaseCard>
}

export function SendAdvertisementsCard({ task }: { task: HydratedLectureTask }) {
    const { t } = useTranslationClient('studio')
    const [ loading, setLoading ] = useState(false)
    const router = useRouter()
    return <BaseCard task={task}>
        <Button color="blue" fullSized disabled={loading} onClick={async () => {
            setLoading(true)
            await sendAdvertisements(task.lectureId, task)
            router.refresh()
        }}><HiCheck className="btn-icon"/>{t('tasks.sendAdvertisements.cta')}</Button>
    </BaseCard>
}

export function UpdateLiveAudienceCard({ task }: { task: HydratedLectureTask }) {
    const { t } = useTranslationClient('studio')
    const [ open, setOpen ] = useState(false)
    const [ audience, setAudience ] = useState('')
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState(false)
    const router = useRouter()
    return <BaseCard task={task}>
        <Button color="blue" onClick={() => setOpen(true)} fullSized><HiMapPin
            className="btn-icon"/>{t('tasks.updateLiveAudience.cta')}</Button>
        <Modal show={open} onClose={() => setOpen(false)}>
            <ModalHeader>{t('tasks.updateLiveAudience.name')}</ModalHeader>
            <ModalBody>
                <p className="mb-3">{t('tasks.updateLiveAudience.modalDescription')}</p>
                <TextInput type="text" required
                           color={error ? 'failure' : undefined}
                           value={audience} onChange={e => setAudience(e.currentTarget.value)}
                           helperText={error ? t('tasks.updateLiveAudience.inputError') : null}/>
            </ModalBody>
            <ModalFooter>
                <Button color="blue" disabled={loading} onClick={async () => {
                    setError(false)
                    if (audience.length < 1) {
                        setError(true)
                        return
                    }
                    try {
                        parseInt(audience)
                    } catch {
                        setError(true)
                        return
                    }

                    setLoading(true)
                    await updateLiveAudience(task.lectureId, task, parseInt(audience))
                    router.refresh()
                }}>
                    {t('tasks.updateLiveAudience.cta')}
                </Button>
                <Button color="gray" onClick={() => setOpen(false)}>
                    {t('cancel')}
                </Button>
            </ModalFooter>
        </Modal>
    </BaseCard>
}

export function SubmitFeedbackCard({ task }: { task: HydratedLectureTask }) {
    const { t } = useTranslationClient('studio')
    const [ loading, setLoading ] = useState(false)
    const [ complete, setComplete ] = useState(false)
    const [ progress, setProgress ] = useState(0)
    const [ error, setError ] = useState(false)

    function upload() {
        const formData = new FormData()
        formData.append('file', ref.current!.files![0])
        formData.append('target', 'feedback')

        setLoading(true)
        const xhr = new XMLHttpRequest()
        xhr.open('POST', `/studio/lectures/${task.lectureId}/upload`, true)
        xhr.upload.onprogress = (e: ProgressEvent) => {
            if (e.lengthComputable) {
                setProgress(Math.round((e.loaded / e.total) * 100))
            }
        }
        xhr.onload = () => {
            setLoading(false)
            setProgress(0)
            if (xhr.status === 200) {
                setComplete(true)
            } else {
                setError(true)
            }
        }
        xhr.onerror = () => {
            setError(true)
        }

        xhr.send(formData)
    }

    const ref = useRef<HTMLInputElement | null>(null)
    return <BaseCard task={task}>
        <input type="file" onChange={upload}
               accept="image/*"
               className="hidden" ref={ref}/>
        <p className="font-bold">{t('uploadMessage')}</p>
        <Button color="blue" fullSized disabled={loading || complete} onClick={() => {
            ref.current?.click()
        }}>
            <HiArrowUpTray className="btn-icon"/>
            <If condition={loading}>
                {progress}%
            </If>
            <If condition={complete}>
                {t('done')}
            </If>
            <If condition={error}>
                {t('tryAgain')}
            </If>
            <If condition={!loading && !complete && !error}>
                {t('tasks.submitFeedback.cta')}
            </If>
        </Button>
    </BaseCard>
}

export function SubmitVideoCard({ task }: { task: HydratedLectureTask }) {
    const { t } = useTranslationClient('studio')
    const [ open, setOpen ] = useState(false)
    const [ video, setVideo ] = useState('')
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState(false)
    const router = useRouter()
    return <BaseCard task={task}>
        <Button color="blue" onClick={() => setOpen(true)} fullSized><HiMapPin
            className="btn-icon"/>{t('tasks.submitVideo.cta')}</Button>
        <Modal show={open} onClose={() => setOpen(false)}>
            <ModalHeader>{t('tasks.submitVideo.name')}</ModalHeader>
            <ModalBody>
                <p className="mb-3"><Trans t={t} i18nKey="tasks.submitReflection.modalDescription"
                                           components={{
                                               1: <span className="font-bold" key={123}/>,
                                               2: <a href="https://youtube.com/upload" className="inline"
                                                     key={256}/>
                                           }}/></p>
                <TextInput type="text" required
                           color={error ? 'failure' : undefined}
                           value={video} onChange={e => setVideo(e.currentTarget.value)}
                           helperText={error ? t('tasks.submitVideo.inputError') : null}/>
            </ModalBody>
            <ModalFooter>
                <Button color="blue" disabled={loading} onClick={async () => {
                    setError(false)
                    try {
                        const url = new URL(video)
                        if (url.host !== 'www.youtube.com' && url.host !== 'youtu.be' && url.host !== 'youtube.com') {
                            setError(true)
                            return
                        }
                        if ((url.host === 'www.youtube.com' || url.host === 'youtube.com') && !url.searchParams.has('v')) {
                            setError(true)
                            return
                        }
                    } catch {
                        setError(true)
                        return
                    }

                    setLoading(true)
                    await submitVideo(task.lectureId, task, video.replace('http://', 'https://'))
                    router.refresh()
                }}>
                    {t('tasks.submitVideo.cta')}
                </Button>
                <Button color="gray" onClick={() => setOpen(false)}>
                    {t('cancel')}
                </Button>
            </ModalFooter>
        </Modal>
    </BaseCard>
}

export function SubmitReflectionCard({ task }: { task: HydratedLectureTask }) {
    const { t } = useTranslationClient('studio')
    const [ open, setOpen ] = useState(false)
    const [ video, setVideo ] = useState('')
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState(false)
    const router = useRouter()
    return <BaseCard task={task}>
        <Button color="blue" onClick={() => setOpen(true)} fullSized><HiMapPin
            className="btn-icon"/>{t('tasks.submitReflection.cta')}</Button>
        <Modal show={open} onClose={() => setOpen(false)}>
            <ModalHeader>{t('tasks.submitReflection.name')}</ModalHeader>
            <ModalBody>
                <p className="mb-3"><Trans t={t} i18nKey="tasks.submitReflection.modalDescription"
                                           components={{
                                               1: <span className="font-bold" key={123}/>,
                                               2: <a href="https://youtube.com/upload" className="inline"
                                                     key={256}/>
                                           }}/></p>
                <TextInput type="text" required
                           color={error ? 'failure' : undefined}
                           value={video} onChange={e => setVideo(e.currentTarget.value)}
                           helperText={error ? t('tasks.submitReflection.inputError') : null}/>
            </ModalBody>
            <ModalFooter>
                <Button color="blue" disabled={loading} onClick={async () => {
                    setError(false)
                    try {
                        const url = new URL(video)
                        if (url.host !== 'www.youtube.com' && url.host !== 'youtu.be' && url.host !== 'youtube.com') {
                            setError(true)
                            return
                        }
                    } catch {
                        setError(true)
                        return
                    }

                    setLoading(true)
                    await submitReflection(task.lectureId, task, video)
                    router.refresh()
                }}>
                    {t('tasks.submitReflection.cta')}
                </Button>
                <Button color="gray" onClick={() => setOpen(false)}>
                    {t('cancel')}
                </Button>
            </ModalFooter>
        </Modal>
    </BaseCard>
}
