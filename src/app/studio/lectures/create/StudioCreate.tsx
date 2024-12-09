'use client'

import { useTranslationClient } from '@/app/i18n/client'
import { Button, Label, Textarea, TextInput } from 'flowbite-react'
import { useState } from 'react'
import { Trans } from 'react-i18next/TransWithoutContext'
import { createLecture } from '@/app/lib/lecture-actions'
import { useRouter } from 'next/navigation'

export default function StudioCreate() {
    const { t } = useTranslationClient('studio')

    const [ title, setTitle ] = useState('')
    const [ contact, setContact ] = useState('')
    const [ surveyQ1, setSurveyQ1 ] = useState('')
    const [ surveyQ2, setSurveyQ2 ] = useState('')
    const [ titleError, setTitleError ] = useState(false)
    const [ contactError, setContactError ] = useState(false)
    const [ surveyQ1Error, setSurveyQ1Error ] = useState(false)
    const [ surveyQ2Error, setSurveyQ2Error ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const router = useRouter()

    function submit() {
        // Validation
        setTitleError(false)
        setContactError(false)
        setSurveyQ1Error(false)
        setSurveyQ2Error(false)
        let failed = false
        if (title.length < 1 || title.length > 100) {
            setTitleError(true)
            failed = true
        }
        if (contact.length < 1 || contact.length > 100) {
            setContactError(true)
            failed = true
        }
        if (surveyQ1.length < 1 || surveyQ1.length > 1000) {
            setSurveyQ1Error(true)
            failed = true
        }
        if (surveyQ2.length < 1 || surveyQ2.length > 1000) {
            setSurveyQ2Error(true)
            failed = true
        }
        if (failed) {
            return
        }

        setLoading(true);
        (async () => {
            router.replace(`/studio/lectures/${(await createLecture(title, contact, surveyQ1, surveyQ2)).id}`)
        })()
    }

    return <div className="base-studio-page">
        <h1 className="mb-3">{t('create.title')}</h1>
        <p className="secondary mb-5">
            <Trans t={t} i18nKey="create.details" components={{
                1: <span key={1} className="text-white font-bold"/>,
                2: <span key={2} className="underline"/>
            }}/>
        </p>
        <div className="flex flex-col gap-4 mb-8">
            <div className="max-w-md">
                <div className="mb-2">
                    <Label htmlFor="title" value={t('create.form.title')}/>
                </div>
                <TextInput id="title" type="text" required
                           color={titleError ? 'failure' : undefined}
                           value={title} onChange={e => setTitle(e.currentTarget.value)}
                           helperText={titleError ? t('create.form.titleError') : null}/>
            </div>
            <div className="max-w-md">
                <div className="mb-2">
                    <Label htmlFor="contact" value={t('create.form.contact')}/>
                </div>
                <TextInput id="contact" type="text" required
                           color={contactError ? 'failure' : undefined}
                           value={contact} onChange={e => setContact(e.currentTarget.value)}
                           helperText={titleError ? t('create.form.contactError') : null}/>
            </div>
            <div className="max-w-xl">
                <div className="mb-2">
                    <Label htmlFor="survey-q1" value={t('create.form.preSurveyQ1')}/>
                </div>
                <Textarea id="survey-q1" rows={5} required
                          color={surveyQ1Error ? 'failure' : undefined}
                          value={surveyQ1} onChange={e => setSurveyQ1(e.currentTarget.value)}
                          helperText={titleError ? t('create.form.surveyQ1Error') : null}/>
            </div>
            <div className="max-w-xl">
                <div className="mb-2">
                    <Label htmlFor="survey-q2" value={t('create.form.preSurveyQ2')}/>
                </div>
                <Textarea id="survey-q2" rows={5} required
                          color={surveyQ2Error ? 'failure' : undefined}
                          value={surveyQ2} onChange={e => setSurveyQ2(e.currentTarget.value)}
                          helperText={titleError ? t('create.form.surveyQ2Error') : null}/>
            </div>
        </div>
        <Button disabled={loading} className="max-w-xl" onClick={submit} fullSized>{t('create.continue')}</Button>
    </div>
}
