import { serverTranslation } from '@/app/i18n'
import StudioCreate from '@/app/studio/lectures/create/StudioCreate'
import { Button } from 'flowbite-react'
import Link from 'next/link'
import { canCreateLecture } from '@/app/lib/lecture-actions'

export default async function StudioCreateBasic() {
    const { t } = await serverTranslation('studio')
    const canCreate = await canCreateLecture()

    if (canCreate) {
        return <StudioCreate/>
    }

    return <div className="base-studio-page">
        <h1 className="mb-3">{t('create.createError.title')}</h1>
        <p className="secondary mb-5">{t('create.createError.message')}</p>
        <Link href="/studio"><Button>{t('create.createError.cta')}</Button></Link>
    </div>
}
