'use client'

import { HydratedLecture } from '@/app/lib/lecture-actions'
import { useTranslationClient } from '@/app/i18n/client'
import { HiInbox } from 'react-icons/hi'
import If from '@/app/lib/If'

export default function LectureTasksC({ lecture }: { lecture: HydratedLecture }) {
    const { t } = useTranslationClient('studio')
    return <>
        <If condition={lecture.tasks.length < 1}>
            <div className="w-full flex flex-col justify-center items-center">
                <HiInbox className="text-7xl mb-3 secondary"/>
                <p>{t('lecture.tasks.empty')}</p>
            </div>
        </If>
    </>
}
