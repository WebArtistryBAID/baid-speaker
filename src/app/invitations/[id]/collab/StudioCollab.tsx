'use client'

import { addCollaborator, HydratedLecture } from '@/app/lib/lecture-actions'
import { useTranslationClient } from '@/app/i18n/client'
import { useEffect, useState } from 'react'
import { User } from '@prisma/client'
import { getMyUser } from '@/app/login/login-actions'
import { Trans } from 'react-i18next/TransWithoutContext'
import { Button, Table, TableBody, TableCell, TableRow } from 'flowbite-react'
import { useRouter } from 'next/navigation'

export default function StudioCollab({ lecture }: { lecture: HydratedLecture }) {
    const { t } = useTranslationClient('studio')
    const [ myUser, setMyUser ] = useState<User>()
    const [ loading, setLoading ] = useState(false)
    const router = useRouter()

    useEffect(() => {
        (async () => {
            setMyUser((await getMyUser())!)
        })()
    }, [])

    if (myUser == null) {
        return <div className="base-studio-page">
            <div className="w-full">
                <div className="w-1/3 h-8 bg-gray-300 dark:bg-gray-700 rounded-3xl mb-3"/>
                <div className="w-1/2 h-8 bg-gray-300 dark:bg-gray-700 rounded-3xl mb-3"/>
                <div className="w-full h-8 bg-gray-300 dark:bg-gray-700 rounded-3xl mb-3"/>
            </div>
        </div>
    }

    if (lecture.collaborators.some(c => c.id === myUser.id) || lecture.assigneeId === myUser.id ||
        lecture.userId === myUser.id || lecture.assigneeTeacher?.id === myUser.id || lecture.posterAssigneeId === myUser.id) {
        router.push(`/studio/lectures/${lecture.id}`)
    }

    return <div className="base-studio-page h-screen">
        <div className="flex justify-center items-center text-center flex-col w-full h-full">
            <h1 className="mb-5">{t('collabInvitation.title')}</h1>
            <p><Trans t={t} i18nKey="collabInvitation.message"
                      components={{ 1: <span className="font-bold" key={189}/> }}
                      values={{ lecture: lecture.title, speaker: lecture.user.name }}/></p>
            <p className="mb-3">{t('collabInvitation.message2')}</p>
            <p className="secondary text-sm mb-3">{t('collabInvitation.info')}</p>
            <Table className="mb-8">
                <TableBody className="divide-y">
                    <TableRow className="tr">
                        <TableCell className="th">{t('collabInvitation.lecture')}</TableCell>
                        <TableCell>{lecture.title}</TableCell>
                    </TableRow>
                    <TableRow className="tr">
                        <TableCell className="th">{t('collabInvitation.speaker')}</TableCell>
                        <TableCell>{lecture.user.name}</TableCell>
                    </TableRow>
                    <TableRow className="tr">
                        <TableCell className="th">{t('collabInvitation.host')}</TableCell>
                        <TableCell>{lecture.assignee?.name ?? t('collabInvitation.notInvited')}</TableCell>
                    </TableRow>
                    <TableRow className="tr">
                        <TableCell className="th">{t('collabInvitation.teacher')}</TableCell>
                        <TableCell>{lecture.assigneeTeacher?.name ?? t('collabInvitation.notInvited')}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Button color="blue" className="max-w-xl" disabled={loading} fullSized onClick={async () => {
                setLoading(true)
                await addCollaborator(lecture.id)
                router.push(`/studio/lectures/${lecture.id}`)
            }}>
                {t('collabInvitation.cta')}
            </Button>
        </div>
    </div>
}
