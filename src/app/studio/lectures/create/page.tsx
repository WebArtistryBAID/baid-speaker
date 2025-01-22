import { serverTranslation } from '@/app/i18n'
import StudioCreate from '@/app/studio/lectures/create/StudioCreate'
import { Breadcrumb, BreadcrumbItem, Button } from 'flowbite-react'
import Link from 'next/link'
import { canCreateLecture } from '@/app/lib/lecture-actions'
import { HiColorSwatch } from 'react-icons/hi'

export default async function StudioCreateBasic() {
    const { t } = await serverTranslation('studio')
    const canCreate = await canCreateLecture()

    if (canCreate) {
        return <StudioCreate/>
    }

    return <div className="base-studio-page">
        <Breadcrumb aria-label={t('breadcrumb.bc')} className="mb-3">
            <BreadcrumbItem href="/studio" icon={HiColorSwatch}>{t('breadcrumb.studio')}</BreadcrumbItem>
            <BreadcrumbItem href="/studio/lectures">{t('breadcrumb.lectures')}</BreadcrumbItem>
            <BreadcrumbItem>{t('breadcrumb.create')}</BreadcrumbItem>
        </Breadcrumb>
        <h1 className="mb-3">{t('create.createError.title')}</h1>
        <p className="secondary mb-5">{t('create.createError.message')}</p>
        <Link href="/studio"><Button color="blue">{t('create.createError.cta')}</Button></Link>
    </div>
}
