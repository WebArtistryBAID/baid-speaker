'use client'

import { HydratedLecture, teacherApprovePresentation } from '@/app/lib/lecture-actions'
import { useTranslationClient } from '@/app/i18n/client'
import { useEffect, useState } from 'react'
import { User, UserType } from '@prisma/client'
import { getMyUser } from '@/app/login/login-actions'
import { Trans } from 'react-i18next/TransWithoutContext'
import { Button, Table, TableBody, TableCell, TableRow } from 'flowbite-react'
import { HiCheckCircle } from 'react-icons/hi'

export default function StudioSlidesApproval({ lecture, uploadServePath }: {
    lecture: HydratedLecture,
    uploadServePath: string
}) {
    const {t} = useTranslationClient('studio')
    const [myUser, setMyUser] = useState<User>()
    const [loading, setLoading] = useState(false)
    const [completed, setCompleted] = useState(false)

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

    if (completed) {
        return <div className="base-studio-page h-screen">
            <div className="flex justify-center items-center text-center flex-col w-full h-full">
                <HiCheckCircle className="text-green-500 text-6xl mb-5"/>
                <h1 className="mb-3">{t('slidesApproval.completed')}</h1>
                <p>{t('slidesApproval.completedMessage')}</p>
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
            <h1 className="mb-5">{t('slidesApproval.title')}</h1>
            <p className="mb-5"><Trans t={t} i18nKey="slidesApproval.message"
                                       components={{1: <span className="font-bold" key={189}/>}}
                                       values={{lecture: lecture.title, speaker: lecture.user.name}}/></p>
            <p className="secondary text-sm mb-3">{t('slidesApproval.info')}</p>
            <Table className="mb-8">
                <TableBody className="divide-y">
                    <TableRow className="tr">
                        <TableCell className="th">{t('slidesApproval.lecture')}</TableCell>
                        <TableCell>{lecture.title}</TableCell>
                    </TableRow>
                    <TableRow className="tr">
                        <TableCell className="th">{t('slidesApproval.speaker')}</TableCell>
                        <TableCell>{lecture.user.name}</TableCell>
                    </TableRow>
                    <TableRow className="tr">
                        <TableCell className="th">{t('slidesApproval.host')}</TableCell>
                        <TableCell>{lecture.assignee!.name}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Button color="blue" className="max-w-xl mb-3" fullSized onClick={() => {
                window.open(`/${uploadServePath}/${lecture.uploadedSlides}`, '_blank')?.focus()
            }}>
                {t('slidesApproval.view')}
            </Button>
            <Button className="max-w-xl" disabled={loading} color="light" fullSized onClick={async () => {
                setLoading(true)
                await teacherApprovePresentation(lecture.id)
                setCompleted(true)
            }}>
                {t('slidesApproval.cta')}
            </Button>
        </div>
    </div>
}
