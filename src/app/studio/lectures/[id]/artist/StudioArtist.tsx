'use client'

import { confirmPosterDesigner, HydratedLecture } from '@/app/lib/lecture-actions'
import { useTranslationClient } from '@/app/i18n/client'
import { useEffect, useState } from 'react'
import { User } from '@prisma/client'
import { getMyUser } from '@/app/login/login-actions'
import { Trans } from 'react-i18next/TransWithoutContext'
import { Button, Table, TableBody, TableCell, TableRow } from 'flowbite-react'
import { useRouter } from 'next/navigation'

export default function StudioArtist({ lecture }: { lecture: HydratedLecture }) {
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

    return <div className="base-studio-page h-screen">
        <div className="flex justify-center items-center text-center flex-col w-full h-full">
            <h1 className="mb-5">{t('artistInvitation.title')}</h1>
            <p><Trans t={t} i18nKey="artistInvitation.message"
                      components={{ 1: <span className="font-bold" key={189}/> }}
                      values={{ lecture: lecture.title, speaker: lecture.user.name }}/></p>
            <p className="mb-3">{t('artistInvitation.message2')}</p>
            <p className="secondary text-sm mb-3">{t('artistInvitation.info')}</p>
            <Table className="mb-8">
                <TableBody className="divide-y">
                    <TableRow className="tr">
                        <TableCell className="th">{t('artistInvitation.lecture')}</TableCell>
                        <TableCell>{lecture.title}</TableCell>
                    </TableRow>
                    <TableRow className="tr">
                        <TableCell className="th">{t('artistInvitation.speaker')}</TableCell>
                        <TableCell>{lecture.user.name}</TableCell>
                    </TableRow>
                    <TableRow className="tr">
                        <TableCell className="th">{t('artistInvitation.host')}</TableCell>
                        <TableCell>{lecture.assignee!.name}</TableCell>
                    </TableRow>
                    <TableRow className="tr">
                        <TableCell className="th">{t('artistInvitation.teacher')}</TableCell>
                        <TableCell>{lecture.assigneeTeacher?.name ?? t('artistInvitation.notInvited')}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Button className="max-w-xl" disabled={loading} fullSized onClick={async () => {
                setLoading(true)
                await confirmPosterDesigner(lecture.id)
                router.push(`/studio/lectures/${lecture.id}`)
            }}>
                {t('artistInvitation.cta')}
            </Button>
        </div>
    </div>
}
