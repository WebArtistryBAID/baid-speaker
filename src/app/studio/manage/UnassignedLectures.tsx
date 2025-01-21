'use client'

import { useEffect, useState } from 'react'
import { claimLecture, getUnassignedLectures, HydratedLecture } from '@/app/lib/lecture-actions'
import { Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react'
import { useTranslationClient } from '@/app/i18n/client'
import { useRouter } from 'next/navigation'
import If from '@/app/lib/If'

export default function UnassignedLectures() {
    const {t} = useTranslationClient('studio')
    const [unassignedLectures, setUnassignedLectures] = useState<HydratedLecture[] | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    function claim(lecture: HydratedLecture) {
        setLoading(true);
        (async () => {
            await claimLecture(lecture.id)
            router.replace(`/studio/lectures/${lecture.id}`)
        })()
    }

    useEffect(() => {
        (async () => {
            setUnassignedLectures(await getUnassignedLectures())
        })()
    }, [])
    if (unassignedLectures == null) {
        return <div className="w-full">
            <div className="w-1/3 h-8 bg-gray-300 dark:bg-gray-700 rounded-3xl mb-3"/>
            <div className="w-1/2 h-8 bg-gray-300 dark:bg-gray-700 rounded-3xl mb-3"/>
            <div className="w-full h-8 bg-gray-300 dark:bg-gray-700 rounded-3xl mb-3"/>
        </div>
    }
    return <>
        <If condition={unassignedLectures.length < 1}>
            <div className="w-full flex flex-col justify-center items-center">
                <img src="/assets/illustrations/good-job-light.png" className="dark:hidden w-72 mb-3" alt=""/>
                <img src="/assets/illustrations/good-job-dark.png" className="hidden dark:block w-72 mb-3" alt=""/>
                <p>{t('manage.unassigned.empty')}</p>
            </div>
        </If>
        <If condition={unassignedLectures.length > 0}>
            <Table>
                <TableHead>
                    <TableHeadCell>{t('manage.unassigned.name')}</TableHeadCell>
                    <TableHeadCell>{t('manage.unassigned.speaker')}</TableHeadCell>
                    <TableHeadCell></TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                    {unassignedLectures.map(lecture => <TableRow className="tr" key={lecture.id}>
                        <TableCell className="th">{lecture.title}</TableCell>
                        <TableCell>{lecture.user.name}</TableCell>
                        <TableCell>
                            <Button disabled={loading} onClick={() => claim(lecture)} pill
                                    size="xs">{t('manage.unassigned.claim')}</Button>
                        </TableCell>
                    </TableRow>)}
                </TableBody>
            </Table>
        </If>
    </>
}
