'use client'

import { useTranslationClient } from '@/app/i18n/client'
import { deleteLecture, HydratedLecture } from '@/app/lib/lecture-actions'
import { useCachedUser } from '@/app/login/login-client'
import If from '@/app/lib/If'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LectureOthers({ lecture }: { lecture: HydratedLecture }) {
    const { t } = useTranslationClient('studio')
    const user = useCachedUser()!
    const [ showCancel, setShowCancel ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const router = useRouter()

    return <>
        <Modal show={showCancel} onClose={() => setShowCancel(false)}>
            <ModalHeader>{t('lecture.others.cancelTitle')}</ModalHeader>
            <ModalBody>
                <p>{t('lecture.others.cancelMessage')}</p>
            </ModalBody>
            <ModalFooter>
                <Button color="red" disabled={loading} onClick={async () => {
                    setLoading(true)
                    await deleteLecture(lecture.id)
                    setLoading(false)
                    router.push('/studio')
                }}>{t('confirm')}</Button>
                <Button color="gray" onClick={() => setShowCancel(false)}>{t('cancel')}</Button>
            </ModalFooter>
        </Modal>

        <If condition={user.id === lecture.assigneeId || user.permissions.includes('admin.manage')}>
            <Button color="red" onClick={() => setShowCancel(true)}>{t('lecture.others.delete')}</Button>
        </If>
        <If condition={!(user.id === lecture.assigneeId || user.permissions.includes('admin.manage'))}>
            <p>{t('lecture.others.cancelDescription')}</p>
        </If>
    </>
}
