'use client'

import { HydratedLecture, schoolApprovePoster, servePosterURL } from '@/app/lib/lecture-actions'
import { useTranslationClient } from '@/app/i18n/client'
import { useEffect, useState } from 'react'
import { User, UserType } from '@prisma/client'
import { getMyUser } from '@/app/login/login-actions'
import { Trans } from 'react-i18next/TransWithoutContext'
import { Button, Table, TableBody, TableCell, TableRow } from 'flowbite-react'
import { HiCheckCircle } from 'react-icons/hi'

export default function StudioPosterApproval({ lecture }: { lecture: HydratedLecture }) {
    const { t } = useTranslationClient('studio')
    const [ myUser, setMyUser ] = useState<User>()
    const [ loading, setLoading ] = useState(false)
    const [ completed, setCompleted ] = useState(false)
    const [ poster, setPoster ] = useState<string>()

    useEffect(() => {
        (async () => {
            setMyUser((await getMyUser())!)
            setPoster(await servePosterURL(lecture.id))
        })()
    }, [])

    if (myUser == null || poster == null) {
        return <div className="base-studio-page">
            <div className="w-full">
                <div className="w-1/3 h-8 bg-gray-300 dark:bg-gray-700 rounded-3xl mb-3"/>
                <div className="w-1/2 h-8 bg-gray-300 dark:bg-gray-700 rounded-3xl mb-3"/>
                <div className="w-full h-8 bg-gray-300 dark:bg-gray-700 rounded-3xl mb-3"/>
            </div>
        </div>
    }

    if (completed) {
        return <div className="base-studio-page h-screen">
            <div className="flex justify-center items-center text-center flex-col w-full h-full">
                <HiCheckCircle className="text-green-500 text-6xl mb-5"/>
                <h1 className="mb-3">{t('posterApproval.completed')}</h1>
                <p>{t('posterApproval.completedMessage')}</p>
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
            <h1 className="mb-5">{t('posterApproval.title')}</h1>
            <p className="mb-5"><Trans t={t} i18nKey="posterApproval.message"
                                       components={{ 1: <span className="font-bold" key={189}/> }}
                                       values={{ lecture: lecture.title, speaker: lecture.user.name }}/></p>
            <p className="secondary text-sm mb-3">{t('posterApproval.info')}</p>
            <Table className="mb-8">
                <TableBody className="divide-y">
                    <TableRow className="tr">
                        <TableCell className="th">{t('posterApproval.lecture')}</TableCell>
                        <TableCell>{lecture.title}</TableCell>
                    </TableRow>
                    <TableRow className="tr">
                        <TableCell className="th">{t('posterApproval.speaker')}</TableCell>
                        <TableCell>{lecture.user.name}</TableCell>
                    </TableRow>
                    <TableRow className="tr">
                        <TableCell className="th">{t('posterApproval.host')}</TableCell>
                        <TableCell>{lecture.assignee!.name}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Button className="max-w-xl mb-3" fullSized onClick={() => {
                window.open(poster, '_blank')?.focus()
            }}>
                {t('posterApproval.view')}
            </Button>
            <Button className="max-w-xl" disabled={loading} color="light" fullSized onClick={async () => {
                setLoading(true)
                await schoolApprovePoster(lecture.id)
                setCompleted(true)
            }}>
                {t('posterApproval.cta')}
            </Button>
        </div>
    </div>
}
