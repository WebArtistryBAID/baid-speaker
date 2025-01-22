'use client'

import { useTranslationClient } from '@/app/i18n/client'

export default function StudioInboxClient() {
    const { t } = useTranslationClient('studio')

    return <div className="base-studio-page">
        <h1>{t('inbox.title')}</h1>
    </div>
}
