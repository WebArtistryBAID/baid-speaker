'use client'

import { useTranslationClient } from '@/app/i18n/client'
import { HydratedLecture, markReclaimable, removeArtist, removeTeacher } from '@/app/lib/lecture-actions'
import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow
} from 'flowbite-react'
import If from '@/app/lib/If'
import { useCachedUser } from '@/app/login/login-client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LectureStatus } from '@prisma/client'
import { HiLink } from 'react-icons/hi'

export default function LectureUsers({ lecture }: { lecture: HydratedLecture }) {
    const { t } = useTranslationClient('studio')
    const [ removeHost, setRemoveHost ] = useState(false)
    const [ removeTeacherOpen, setRemoveTeacher ] = useState(false)
    const [ removeArtistOpen, setRemoveArtist ] = useState(false)
    const [ copied, setCopied ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const router = useRouter()

    const user = useCachedUser()!
    return <>
        <p className="mb-3">{t('lecture.people.message')}</p>

        <Modal show={removeHost} size="xl" onClose={() => setRemoveHost(false)}>
            <ModalHeader>{t('lecture.people.removeConfirm')}</ModalHeader>
            <ModalBody>
                <p className="mb-3">{t('lecture.people.removeHostConfirm')}</p>
            </ModalBody>
            <ModalFooter>
                <Button color="blue" disabled={loading} onClick={async () => {
                    setLoading(true)
                    await markReclaimable(lecture.id)
                    setLoading(false)
                    setRemoveHost(false)
                    router.refresh()
                }}>{t('confirm')}</Button>
                <Button color="gray" onClick={() => setRemoveHost(false)}>
                    {t('cancel')}
                </Button>
            </ModalFooter>
        </Modal>

        <Modal show={removeTeacherOpen} size="xl" onClose={() => setRemoveTeacher(false)}>
            <ModalHeader>{t('lecture.people.removeConfirm')}</ModalHeader>
            <ModalBody>
                <p className="mb-3">{t('lecture.people.removeTeacherConfirm')}</p>
            </ModalBody>
            <ModalFooter>
                <Button color="blue" disabled={loading} onClick={async () => {
                    setLoading(true)
                    await removeTeacher(lecture.id)
                    setLoading(false)
                    setRemoveTeacher(false)
                    router.refresh()
                }}>{t('confirm')}</Button>
                <Button color="gray" onClick={() => setRemoveTeacher(false)}>
                    {t('cancel')}
                </Button>
            </ModalFooter>
        </Modal>

        <Modal show={removeArtistOpen} size="xl" onClose={() => setRemoveArtist(false)}>
            <ModalHeader>{t('lecture.people.removeConfirm')}</ModalHeader>
            <ModalBody>
                <p className="mb-3">{t('lecture.people.removeArtistConfirm')}</p>
            </ModalBody>
            <ModalFooter>
                <Button color="blue" disabled={loading} onClick={async () => {
                    setLoading(true)
                    await removeArtist(lecture.id)
                    setLoading(false)
                    setRemoveArtist(false)
                    router.refresh()
                }}>{t('confirm')}</Button>
                <Button color="gray" onClick={() => setRemoveArtist(false)}>
                    {t('cancel')}
                </Button>
            </ModalFooter>
        </Modal>

        <Table className="mb-5">
            <TableHead>
                <TableHeadCell>{t('lecture.people.name')}</TableHeadCell>
                <TableHeadCell>{t('lecture.people.phone')}</TableHeadCell>
                <TableHeadCell>{t('lecture.people.role')}</TableHeadCell>
                <If condition={user.permissions.includes('admin.manage')}>
                    <TableHeadCell>{t('lecture.people.action')}</TableHeadCell>
                </If>
            </TableHead>
            <TableBody className="divide-y">
                <TableRow className="tr">
                    <TableCell className="th">{lecture.user.name}</TableCell>
                    <TableCell>{lecture.contactWeChat}</TableCell>
                    <TableCell>{t('lecture.people.speaker')}</TableCell>
                    <If condition={user.permissions.includes('admin.manage')}>
                        <TableCell/>
                    </If>
                </TableRow>
                {lecture.collaborators.map(collaborator => <TableRow className="tr" key={collaborator.id}>
                    <TableCell className="th">{collaborator.name}</TableCell>
                    <TableCell>{collaborator.phone}</TableCell>
                    <TableCell>{t('lecture.people.collaborator')}</TableCell>
                    <If condition={user.permissions.includes('admin.manage')}>
                        <TableCell/>
                    </If>
                </TableRow>)}
                <If condition={lecture.assigneeId != null}>
                    <TableRow className="tr">
                        <TableCell className="th">{lecture.assignee?.name}</TableCell>
                        <TableCell>{lecture.assignee?.phone}</TableCell>
                        <TableCell>{t('lecture.people.host')}</TableCell>
                        <If condition={user.permissions.includes('admin.manage') &&
                            (lecture.status === LectureStatus.completingPreTasks ||
                                lecture.status === LectureStatus.ready ||
                                lecture.status === LectureStatus.completingPostTasks)}>
                            <If condition={lecture.reclaimable}>
                                <TableCell/>
                            </If>
                            <If condition={!lecture.reclaimable}>
                                <TableCell><Button color="blue" disabled={loading} onClick={() => setRemoveHost(true)}
                                                   pill
                                                   size="xs">{t('lecture.people.remove')}</Button></TableCell>
                            </If>
                        </If>
                        <If condition={user.permissions.includes('admin.manage') && !(lecture.status === LectureStatus.completingPreTasks ||
                            lecture.status === LectureStatus.ready ||
                            lecture.status === LectureStatus.completingPostTasks)}>
                            <TableCell/>
                        </If>
                    </TableRow>
                </If>
                <If condition={lecture.assigneeTeacherId != null}>
                    <TableRow className="tr">
                        <TableCell className="th">{lecture.assigneeTeacher?.name}</TableCell>
                        <TableCell>{lecture.assigneeTeacher?.phone}</TableCell>
                        <TableCell>{t('lecture.people.teacher')}</TableCell>
                        <If condition={user.permissions.includes('admin.manage') && lecture.status === LectureStatus.completingPreTasks}>
                            <TableCell><Button color="blue" disabled={loading} onClick={() => setRemoveTeacher(true)}
                                               pill
                                               size="xs">{t('lecture.people.remove')}</Button></TableCell>
                        </If>
                        <If condition={user.permissions.includes('admin.manage') && lecture.status !== LectureStatus.completingPreTasks}>
                            <TableCell/>
                        </If>
                    </TableRow>
                </If>
                <If condition={lecture.posterAssigneeId != null}>
                    <TableRow className="tr">
                        <TableCell className="th">{lecture.posterAssignee?.name}</TableCell>
                        <TableCell>{lecture.posterAssignee?.phone}</TableCell>
                        <TableCell>{t('lecture.people.poster')}</TableCell>
                        <If condition={user.permissions.includes('admin.manage') && lecture.status === LectureStatus.completingPreTasks}>
                            <TableCell><Button color="blue" disabled={loading} onClick={() => setRemoveArtist(true)}
                                               pill
                                               size="xs">{t('lecture.people.remove')}</Button></TableCell>
                        </If>
                        <If condition={user.permissions.includes('admin.manage') && lecture.status !== LectureStatus.completingPreTasks}>
                            <TableCell/>
                        </If>
                    </TableRow>
                </If>
                <TableRow className="tr">
                    <TableCell className="th">{t('lecture.people.other')}</TableCell>
                    <TableCell className="th"></TableCell>
                    <TableCell className="th"></TableCell>
                    <If condition={user.permissions.includes('admin.manage')}>
                        <TableCell/>
                    </If>
                </TableRow>
            </TableBody>
        </Table>

        <Button color="blue" onClick={async () => {
            await navigator.clipboard.writeText(`${location.origin}/invitations/${lecture.id}/collab`)
            setCopied(true)
            setTimeout(() => {
                setCopied(false)
            }, 3000)
        }}>
            <HiLink className="btn-icon"/>{t(copied ? 'copied' : 'lecture.people.inviteCollab')}
        </Button>
    </>
}
