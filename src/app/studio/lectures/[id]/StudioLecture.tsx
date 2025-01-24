'use client'

import { useTranslationClient } from '@/app/i18n/client'
import {
    Alert,
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    TabItem,
    Tabs,
    TabsRef
} from 'flowbite-react'
import {
    HiCalendar,
    HiChartBar,
    HiChartPie,
    HiChip,
    HiColorSwatch,
    HiDocumentText,
    HiRefresh,
    HiUsers
} from 'react-icons/hi'
import { HydratedLecture } from '@/app/lib/lecture-actions'
import { useEffect, useRef, useState } from 'react'
import LectureDashboard from '@/app/studio/lectures/[id]/LectureDashboard'
import LectureTasksC from '@/app/studio/lectures/[id]/LectureTasks'
import LectureUsers from '@/app/studio/lectures/[id]/LectureUsers'
import If from '@/app/lib/If'
import { User } from '@prisma/client'
import { getMyUser } from '@/app/login/login-actions'
import LectureHistory from '@/app/studio/lectures/[id]/LectureHistory'
import LectureContent from '@/app/studio/lectures/[id]/LectureContent'
import LectureStatistics from '@/app/studio/lectures/[id]/LectureStatistics'
import LectureOthers from '@/app/studio/lectures/[id]/LectureOthers'
import { Joyride, TooltipRenderProps } from 'react-joyride'

function JoyrideTooltip(props: TooltipRenderProps) {
    const { backProps, index, primaryProps, step, tooltipProps } = props

    return <div className="p-5 max-w-md bg-white rounded-3xl dark:bg-gray-700" {...tooltipProps}>
        <h3 className="mb-3">{step.title}</h3>
        <p className="mb-5">{step.content}</p>
        <div className="flex gap-3 items-center">
            <If condition={index > 0}>
                <Button {...backProps} color="gray">
                    {backProps.title}
                </Button>
            </If>
            <Button {...primaryProps} color="blue">
                {primaryProps.title}
            </Button>
        </div>
    </div>
}

export default function StudioLecture({ lecture, uploadServePath }: {
    lecture: HydratedLecture,
    uploadServePath: string
}) {
    const { t } = useTranslationClient('studio')
    const tabsRef = useRef<TabsRef>(null)

    const [ myUser, setMyUser ] = useState<User>()
    const [ onboardingModal, setOnboardingModal ] = useState(false)
    const [ runJoyride, setRunJoyride ] = useState(false)
    const [ joyrideSteps, setJoyrideSteps ] = useState([ {
        title: '...',
        target: '[role=tablist]>button:nth-child(1)',
        content: '...',
        disableBeacon: true
    },
        {
            title: '...',
            target: '[role=tablist]>button:nth-child(2)',
            content: '...',
            disableBeacon: true
        },
        {
            title: '...',
            target: '[role=tablist]>button:nth-child(3)',
            content: '...',
            disableBeacon: true
        },
        {
            title: '...',
            target: '[role=tablist]>button:nth-child(5)',
            content: '...',
            disableBeacon: true
        },
        {
            title: '...',
            target: 'body',
            placement: 'center' as const,
            content: '...',
            disableBeacon: true
        } ])

    useEffect(() => {
        (async () => {
            setMyUser((await getMyUser())!)
        })()
        setJoyrideSteps(
            [
                {
                    title: t('lecture.tabs.dashboard'),
                    target: '[role=tablist]>button:nth-child(1)',
                    content: t('lecture.onboarding.step1'),
                    disableBeacon: true
                },
                {
                    title: t('lecture.tabs.tasks'),
                    target: '[role=tablist]>button:nth-child(2)',
                    content: t('lecture.onboarding.step2'),
                    disableBeacon: true
                },
                {
                    title: t('lecture.tabs.users'),
                    target: '[role=tablist]>button:nth-child(3)',
                    content: t('lecture.onboarding.step3'),
                    disableBeacon: true
                },
                {
                    title: t('lecture.tabs.content'),
                    target: '[role=tablist]>button:nth-child(5)',
                    content: t('lecture.onboarding.step4'),
                    disableBeacon: true
                },
                {
                    title: t('lecture.onboarding.step5Title'),
                    target: 'body',
                    placement: 'center',
                    content: t('lecture.onboarding.step5'),
                    disableBeacon: true
                }
            ]
        )
        if (localStorage.getItem('onboarding') == null) {
            setOnboardingModal(true)
            localStorage.setItem('onboarding', 'done')
        }
    }, [ t ])

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
        <Breadcrumb aria-label={t('breadcrumb.bc')} className="mb-3">
            <BreadcrumbItem href="/studio" icon={HiColorSwatch}>{t('breadcrumb.studio')}</BreadcrumbItem>
            <BreadcrumbItem href="/studio/lectures">{t('breadcrumb.lectures')}</BreadcrumbItem>
            <BreadcrumbItem>{t('breadcrumb.lecture')}</BreadcrumbItem>
        </Breadcrumb>
        <Modal show={onboardingModal} size="xl" onClose={() => setOnboardingModal(false)}>
            <ModalHeader>{t('lecture.onboarding.title')}</ModalHeader>
            <ModalBody>
                <p className="mb-3">{t('lecture.onboarding.message')}</p>
                <div className="w-full flex flex-col justify-center items-center">
                    <img src="/assets/illustrations/location-map-light.png" className="dark:hidden w-72 mb-3" alt=""/>
                    <img src="/assets/illustrations/location-map-dark.png" className="hidden dark:block w-72 mb-3"
                         alt=""/>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="blue" onClick={() => {
                    setRunJoyride(true)
                    setOnboardingModal(false)
                }}>{t('continue')}</Button>
                <Button color="gray" onClick={() => setOnboardingModal(false)}>
                    {t('skip')}
                </Button>
            </ModalFooter>
        </Modal>

        <h1 className="mb-3">{lecture.title}</h1>
        <p className="text-xl mb-5 secondary">{lecture.user.name}</p>
        <If condition={myUser.id !== lecture.user.id}>
            <Alert color="info" className="mb-3">{t('lecture.userAlert')}</Alert>
        </If>
        <Tabs aria-label={t('lecture.tabs.title')} variant="underline" ref={tabsRef}>
            <TabItem active color="blue" title={t('lecture.tabs.dashboard')} icon={HiChartPie}>
                <div className="h-full min-h-full overflow-y-auto">
                    <LectureDashboard lecture={lecture} tabsRef={tabsRef.current!}/>
                </div>
            </TabItem>
            <TabItem color="blue" title={t('lecture.tabs.tasks')} icon={HiCalendar}>
                <div className="h-full min-h-full overflow-y-auto">
                    <LectureTasksC lecture={lecture}/>
                </div>
            </TabItem>
            <TabItem color="blue" title={t('lecture.tabs.users')} icon={HiUsers}>
                <div className="h-full min-h-full overflow-y-auto">
                    <LectureUsers lecture={lecture}/>
                </div>
            </TabItem>
            <TabItem color="blue" title={t('lecture.tabs.history')} icon={HiRefresh}>
                <div className="h-full min-h-full overflow-y-auto">
                    <LectureHistory lecture={lecture}/>
                </div>
            </TabItem>
            <TabItem color="blue" title={t('lecture.tabs.content')} icon={HiDocumentText}>
                <div className="h-full min-h-full overflow-y-auto">
                    <LectureContent lecture={lecture} uploadServePath={uploadServePath}/>
                </div>
            </TabItem>
            <TabItem color="blue" title={t('lecture.tabs.statistics')} icon={HiChartBar}>
                <div className="h-full min-h-full overflow-y-auto">
                    <LectureStatistics lecture={lecture} uploadServePath={uploadServePath}/>
                </div>
            </TabItem>
            <TabItem color="blue" title={t('lecture.tabs.others')} icon={HiChip}>
                <div className="h-full min-h-full overflow-y-auto">
                    <LectureOthers lecture={lecture}/>
                </div>
            </TabItem>
        </Tabs>
        <Joyride run={runJoyride} continuous={true} tooltipComponent={JoyrideTooltip} steps={joyrideSteps} locale={{
            back: t('back'),
            close: t('close'),
            last: t('close'),
            next: t('next'),
            skip: t('skip')
        }}/>
    </div>
}
