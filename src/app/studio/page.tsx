import { serverTranslation } from '@/app/i18n'
import { Breadcrumb, BreadcrumbItem, Button, Card } from 'flowbite-react'
import { HiArrowRight, HiColorSwatch } from 'react-icons/hi'
import { requireUserPermission } from '@/app/login/login-actions'
import { getMyOwnLatestLecture } from '@/app/lib/lecture-actions'
import If from '@/app/lib/If'
import Link from 'next/link'
import { LectureStatus } from '@/generated/prisma/browser'

export default async function StudioHome() {
    const { t } = await serverTranslation('studio')

    await requireUserPermission('admin.manage')
    const lecture = await getMyOwnLatestLecture()

    return <div className="base-studio-page">
        <Breadcrumb aria-label={t('breadcrumb.bc')} className="mb-3">
            <BreadcrumbItem icon={HiColorSwatch}>{t('breadcrumb.studio')}</BreadcrumbItem>
        </Breadcrumb>
        <h1 className="mb-8">{t('nav.dashboard')}</h1>
        <h2 className="mb-5 font-normal">{t('dashboard.onboarding')}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-8">
            <If condition={lecture != null && lecture.status !== LectureStatus.completed}>
                <Card className="col-span-2">
                    <h2>{t('dashboard.continueCard.title')}</h2>
                    <p className="secondary xl:mb-6">{t('dashboard.continueCard.subtitle')}</p>
                    <Link href={`/studio/lectures/${lecture?.id}`}>
                        <Button as="div">
                            {t('dashboard.continueCard.cta')}
                            <HiArrowRight className="btn-guide-icon"/>
                        </Button>
                    </Link>
                </Card>
            </If>
            <If condition={lecture == null || lecture.status === LectureStatus.completed}>
                <Card className="col-span-2">
                    <h2>{t('dashboard.createCard.title')}</h2>
                    <p className="secondary xl:mb-6">{t('dashboard.createCard.subtitle')}</p>
                    <Link href="/studio/lectures/create">
                        <Button as="div">
                            {t('dashboard.createCard.cta')}
                            <HiArrowRight className="btn-guide-icon"/>
                        </Button>
                    </Link>
                </Card>
            </If>
            <Card className="col-span-1">
                <h2>{t('dashboard.tutorialCard.title')}</h2>
                <p className="secondary">{t('dashboard.tutorialCard.subtitle')}</p>
                <Button color="blue">
                    {t('dashboard.tutorialCard.cta')}
                    <HiArrowRight className="btn-guide-icon"/>
                </Button>
            </Card>
            <Card className="col-span-1 xl:hidden 2xl:block">
                <h2>{t('dashboard.watchCard.title')}</h2>
                <p className="secondary">{t('dashboard.watchCard.subtitle')}</p>
                <Button color="warning">
                    {t('dashboard.watchCard.cta')}
                    <HiArrowRight className="btn-guide-icon"/>
                </Button>
            </Card>
        </div>
    </div>
}
