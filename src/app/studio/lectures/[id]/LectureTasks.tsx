'use client'

import { HydratedLecture } from '@/app/lib/lecture-actions'
import { useTranslationClient } from '@/app/i18n/client'
import If from '@/app/lib/If'
import TaskCard from '@/app/studio/lectures/[id]/task-cards'
import { useCachedUser } from '@/app/login/login-client'

export default function LectureTasksC({lecture}: { lecture: HydratedLecture }) {
    const {t} = useTranslationClient('studio')
    const user = useCachedUser()!

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
                <img src="/assets/illustrations/good-job-light.png" className="dark:hidden w-72 mb-3" alt=""/>
                <img src="/assets/illustrations/good-job-dark.png" className="hidden dark:block w-72 mb-3" alt=""/>
                <p>{t('lecture.tasks.empty')}</p>
            </div>
        </If>
        <If condition={tasks.length > 0}>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-8">
                {tasks.map(task =>
                    <div key={task.id} className="col-span-1 h-full w-full">
                        <TaskCard task={task}/>
                    </div>)}
            </div>
        </If>
    </>
}
