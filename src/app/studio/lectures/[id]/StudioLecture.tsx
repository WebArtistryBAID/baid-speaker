'use client'

import { useTranslationClient } from '@/app/i18n/client'
import { Alert, Breadcrumb, BreadcrumbItem, TabItem, Tabs, TabsRef } from 'flowbite-react'
import { HiColorSwatch, HiDocumentText } from 'react-icons/hi'
import { HydratedLecture } from '@/app/lib/lecture-actions'
import { useEffect, useRef, useState } from 'react'
import If from '@/app/lib/If'
import { User } from '@/generated/prisma/browser'
import { getMyUser } from '@/app/login/login-actions'
import LectureContent from '@/app/studio/lectures/[id]/LectureContent'

export default function StudioLecture({ lecture, uploadServePath }: {
    lecture: HydratedLecture,
    uploadServePath: string
}) {
    const { t } = useTranslationClient('studio')
    const tabsRef = useRef<TabsRef>(null)
    const [ myUser, setMyUser ] = useState<User>()

    useEffect(() => {
        (async () => {
            setMyUser((await getMyUser())!)
        })()
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
        <h1 className="mb-3">{lecture.title}</h1>
        <p className="text-xl mb-5 secondary">{lecture.user.name}</p>
        <If condition={myUser.id !== lecture.user.id}>
            <Alert color="info" className="mb-3">{t('lecture.userAlert')}</Alert>
        </If>
        <Tabs aria-label={t('lecture.tabs.title')} variant="underline" ref={tabsRef}>
            <TabItem color="blue" title={t('lecture.tabs.content')} icon={HiDocumentText}>
                <div className="h-full min-h-full overflow-y-auto">
                    <LectureContent lecture={lecture} uploadServePath={uploadServePath}/>
                </div>
            </TabItem>
        </Tabs>
    </div>
}
