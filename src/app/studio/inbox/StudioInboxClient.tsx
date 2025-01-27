'use client'

import {useTranslationClient} from '@/app/i18n/client'
import {Paginated} from '@/app/lib/lecture-actions'
import {useEffect, useState} from 'react'
import {dismissNotification, getMyNotifications, HydratedNotification} from '@/app/login/login-actions'
import If from '@/app/lib/If'
import {Alert, Breadcrumb, BreadcrumbItem, Pagination} from 'flowbite-react'
import {HiColorSwatch, HiInformationCircle} from 'react-icons/hi'
import {NotificationType} from '@prisma/client'
import {Trans} from 'react-i18next/TransWithoutContext'
import Link from 'next/link'

export default function StudioInboxClient({ notifications }: { notifications: Paginated<HydratedNotification> }) {
    const { t } = useTranslationClient('studio')
    const [ currentPage, setCurrentPage ] = useState(0)
    const [ page, setPage ] = useState<Paginated<HydratedNotification>>(notifications)
    const [ loading, setLoading ] = useState(false)

    useEffect(() => {
        (async () => {
            if (page.page !== currentPage) {
                setPage(await getMyNotifications(currentPage))
            }
        })()
    }, [ currentPage ])

    return <div className="base-studio-page">
        <Breadcrumb aria-label={t('breadcrumb.bc')} className="mb-3">
            <BreadcrumbItem href="/studio" icon={HiColorSwatch}>{t('breadcrumb.studio')}</BreadcrumbItem>
            <BreadcrumbItem>{t('breadcrumb.inbox')}</BreadcrumbItem>
        </Breadcrumb>
        <h1 className="mb-5">{t('inbox.title')}</h1>
        <If condition={page.pages < 1}>
            <div className="w-full h-[60dvh] flex flex-col justify-center items-center">
                <img src="/assets/illustrations/inbox-light.png" className="dark:hidden w-72" alt=""/>
                <img src="/assets/illustrations/inbox-dark.png" className="hidden dark:block w-72" alt=""/>
                <p className="mb-3">{t('inbox.empty')}</p>
            </div>
        </If>
        <If condition={page.pages > 0}>
            {page.items.map(notification => {
                // eslint-disable-next-line
                const messageData: any = {
                    user: notification.values[0],
                    lecture: notification.lecture?.title
                }
                switch (notification.type) {
                    case NotificationType.confirmedDate:
                        messageData.v0 = new Date(parseInt(notification.values[1])).toLocaleDateString().replaceAll('/', '-')
                        break
                    case NotificationType.confirmedLocation:
                        messageData.v0 = notification.values[1]
                        break
                    case NotificationType.updatedLiveAudience:
                        messageData.v0 = notification.values[1]
                        break
                    case NotificationType.modifiedStatus:
                        messageData.v0 = t(`lectureStatus.${notification.values[1]}.name`)
                }

                return <Alert key={notification.id} color="gray" icon={HiInformationCircle} className="mb-3" rounded
                              onDismiss={async () => {
                                  if (loading) {
                                      return
                                  }
                                  setLoading(true)
                                  await dismissNotification(notification.id)
                                  setLoading(false)
                                  setPage(await getMyNotifications(currentPage))
                              }}>
                    <Trans t={t} i18nKey={`notifications.${notification.type}`} values={messageData}
                           components={{ 1: <span key={581} className="font-bold"/> }}/>
                    <If condition={notification.lectureId != null}>
                        <Link href={`/studio/lectures/${notification.lectureId}`}
                              className="inline ml-2">{t('inbox.view')}</Link>
                    </If>
                </Alert>
            })}

            <div className="flex overflow-x-auto sm:justify-center">
                <If condition={page.pages > 0}>
                    <Pagination currentPage={currentPage + 1} onPageChange={p => setCurrentPage(p - 1)}
                                totalPages={page.pages}/>
                </If>
            </div>
        </If>
    </div>
}
