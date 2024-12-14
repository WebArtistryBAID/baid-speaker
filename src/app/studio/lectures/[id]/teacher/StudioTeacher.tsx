'use client'

import { HydratedLecture, inviteTeacher } from '@/app/lib/lecture-actions'
import { useTranslationClient } from '@/app/i18n/client'
import { useEffect, useState } from 'react'
import { User, UserType } from '@prisma/client'
import { getMyUser } from '@/app/login/login-actions'
import { Trans } from 'react-i18next/TransWithoutContext'
import { Button, Table, TableBody, TableCell, TableRow } from 'flowbite-react'
import { useRouter } from 'next/navigation'

export default function StudioTeacher({ lecture }: { lecture: HydratedLecture }) {
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

    if (myUser.type !== UserType.teacher) {
        return <div className="base-studio-page h-screen">
            <div className="flex justify-center items-center text-center flex-col w-full h-full">
                <h1 className="mb-5">{t('teacherInvitation.unsupported')}</h1>
                <p>{t('teacherInvitation.unsupportedMessage')}</p>
            </div>
        </div>
    }

    return <div className="base-studio-page h-screen">
        <div className="flex justify-center items-center text-center flex-col w-full h-full">
            <h1 className="mb-5">{t('teacherInvitation.title')}</h1>
            <p><Trans t={t} i18nKey="teacherInvitation.message"
                      components={{ 1: <span className="font-bold" key={189}/> }}
                      values={{ lecture: lecture.title, speaker: lecture.user.name }}/></p>
            <p className="mb-3">{t('teacherInvitation.message2')}</p>
            <ul className="list-disc list-inside mb-5">
                <li>{t('teacherInvitation.task1')}</li>
                <li>{t('teacherInvitation.task2')}</li>
                <li>{t('teacherInvitation.task3')}</li>
            </ul>
            <p className="secondary text-sm mb-3">{t('teacherInvitation.info')}</p>
            <Table className="mb-8">
                <TableBody className="divide-y">
                    <TableRow className="tr">
                        <TableCell className="th">{t('teacherInvitation.lecture')}</TableCell>
                        <TableCell>{lecture.title}</TableCell>
                    </TableRow>
                    <TableRow className="tr">
                        <TableCell className="th">{t('teacherInvitation.speaker')}</TableCell>
                        <TableCell>{lecture.user.name}</TableCell>
                    </TableRow>
                    <TableRow className="tr">
                        <TableCell className="th">{t('teacherInvitation.host')}</TableCell>
                        <TableCell>{lecture.assignee!.name}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Button className="max-w-xl" disabled={loading} fullSized onClick={async () => {
                setLoading(true)
                await inviteTeacher(lecture.id)
                router.push(`/studio/lectures/${lecture.id}`)
            }}>
                {t('teacherInvitation.cta')}
            </Button>
        </div>
    </div>
}
