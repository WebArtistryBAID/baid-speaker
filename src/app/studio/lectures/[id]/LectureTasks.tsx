'use client'

import {HydratedLecture} from '@/app/lib/lecture-actions'
import {useTranslationClient} from '@/app/i18n/client'
import {HiInbox} from 'react-icons/hi'
import If from '@/app/lib/If'
import TaskCard from '@/app/studio/lectures/[id]/task-cards'
import {useCachedUser} from '@/app/login/login-client'

export default function LectureTasksC({lecture}: { lecture: HydratedLecture }) {
    const {t} = useTranslationClient('studio')
    const user = useCachedUser()

    const tasks = lecture.tasks.toSorted((a, b) => {
        const aIsNotAssigned = a.assigneeId !== user.id ? 1 : 0
        const bIsNotAssigned = b.assigneeId !== user.id ? 1 : 0
        if (aIsNotAssigned !== bIsNotAssigned) {
            return aIsNotAssigned - bIsNotAssigned
        }
        const timeDiffA = a.dueAt.getTime() - new Date().getTime()
        const timeDiffB = b.dueAt.getTime() - new Date().getTime()
        return timeDiffA - timeDiffB
    })

    return <>
        <If condition={tasks.length < 1}>
            <div className="w-full flex flex-col justify-center items-center">
                <HiInbox className="text-7xl mb-3 secondary"/>
                <p>{t('lecture.tasks.empty')}</p>
            </div>
        </If>
        <If condition={tasks.length > 0}>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-8">
                {tasks.map(task =>
                    <div key={task.id} className="col-span-1">
                        <TaskCard task={task}/>
                    </div>)}
            </div>
        </If>
    </>
}
