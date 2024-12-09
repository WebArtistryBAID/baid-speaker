'use client'

import { useTranslationClient } from '@/app/i18n/client'
import { HydratedLecture } from '@/app/lib/lecture-actions'
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react'
import If from '@/app/lib/If'

export default function LectureUsers({ lecture }: { lecture: HydratedLecture }) {
    const { t } = useTranslationClient('studio')
    return <>
        <p className="mb-3">{t('lecture.people.message')}</p>
        <Table>
            <TableHead>
                <TableHeadCell>{t('lecture.people.name')}</TableHeadCell>
                <TableHeadCell>{t('lecture.people.phone')}</TableHeadCell>
                <TableHeadCell>{t('lecture.people.role')}</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
                <TableRow className="tr">
                    <TableCell className="th">{lecture.user.name}</TableCell>
                    <TableCell>{lecture.user.phone}</TableCell>
                    <TableCell>{t('lecture.people.speaker')}</TableCell>
                </TableRow>
                <If condition={lecture.assigneeId != null}>
                    <TableRow className="tr">
                        <TableCell className="th">{lecture.assignee?.name}</TableCell>
                        <TableCell>{lecture.assignee?.phone}</TableCell>
                        <TableCell>{t('lecture.people.host')}</TableCell>
                    </TableRow>
                </If>
                <If condition={lecture.assigneeTeacherId != null}>
                    <TableRow className="tr">
                        <TableCell className="th">{lecture.assigneeTeacher?.name}</TableCell>
                        <TableCell>{lecture.assigneeTeacher?.phone}</TableCell>
                        <TableCell>{t('lecture.people.teacher')}</TableCell>
                    </TableRow>
                </If>
                <If condition={lecture.posterAssigneeId != null}>
                    <TableRow className="tr">
                        <TableCell className="th">{lecture.posterAssignee?.name}</TableCell>
                        <TableCell>{lecture.posterAssignee?.phone}</TableCell>
                        <TableCell>{t('lecture.people.poster')}</TableCell>
                    </TableRow>
                </If>
                <TableRow className="tr">
                    <TableCell className="th">{t('lecture.people.other')}</TableCell>
                    <TableCell className="th"></TableCell>
                    <TableCell className="th"></TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </>
}
