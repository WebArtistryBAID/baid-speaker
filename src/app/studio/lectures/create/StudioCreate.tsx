'use client'

import { useTranslationClient } from '@/app/i18n/client'
import { Breadcrumb, BreadcrumbItem, Button, Label, TextInput } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { Trans } from 'react-i18next/TransWithoutContext'
import { createLecture } from '@/app/lib/lecture-actions'
import { useRouter } from 'next/navigation'
import { HiColorSwatch } from 'react-icons/hi'

export default function StudioCreate() {
    const { t } = useTranslationClient('studio')

    const [ title, setTitle ] = useState('')
    const [ titleError, setTitleError ] = useState(false)
    const [ speaker, setSpeaker ] = useState('')
    const [ speakerError, setSpeakerError ] = useState(false)
    const [ host, setHost ] = useState('')
    const [ hostError, setHostError ] = useState(false)
    const [ date, setDate ] = useState('')
    const [ dateError, setDateError ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const router = useRouter()

    useEffect(() => {
        setTitle(localStorage.getItem('baid-speaker-title') ?? '')
    }, [])

    useEffect(() => {
        localStorage.setItem('baid-speaker-title', title)
    }, [ title ])

    function submit() {
        // Validation
        setTitleError(false)
        setSpeakerError(false)
        setHostError(false)
        setDateError(false)
        let failed = false
        if (title.length < 1 || title.length > 100) {
            setTitleError(true)
            failed = true
        }
        if (speaker.length < 1 || speaker.length > 100) {
            setSpeakerError(true)
            failed = true
        }
        if (host.length < 1 || host.length > 100) {
            setHostError(true)
            failed = true
        }
        if (date.length !== 10) {
            setDateError(true)
            failed = true
        }
        if (failed) {
            return
        }
        setLoading(true);
        (async () => {
            router.replace(`/studio/lectures/${(await createLecture(title, speaker, host, date)).id}`)
        })()
    }

    return <div className="base-studio-page">
        <Breadcrumb aria-label={t('breadcrumb.bc')} className="mb-3">
            <BreadcrumbItem href="/studio" icon={HiColorSwatch}>{t('breadcrumb.studio')}</BreadcrumbItem>
            <BreadcrumbItem href="/studio/lectures">{t('breadcrumb.lectures')}</BreadcrumbItem>
            <BreadcrumbItem>{t('breadcrumb.create')}</BreadcrumbItem>
        </Breadcrumb>
        <h1 className="mb-3">{t('create.title')}</h1>
        <p className="secondary mb-5">
            <Trans t={t} i18nKey="create.details" components={{
                1: <span key={1} className="text-white font-bold"/>,
                2: <span key={2} className="underline"/>
            }}/>
        </p>
        <div className="grid grid-cols-1 xl:grid-cols-2 grid-rows-1 mb-8 gap-4">
            <div>
                <div className="flex flex-col gap-4 mb-5">
                    <div className="w-full">
                        <div className="mb-2">
                            <Label htmlFor="title" value={t('create.form.title')}/>
                        </div>
                        <TextInput id="title" type="text" required
                                   color={titleError ? 'failure' : undefined}
                                   value={title} onChange={e => setTitle(e.currentTarget.value)}
                                   helperText={titleError ? t('create.form.titleError') : null}/>
                    </div>

                    <div className="w-full">
                        <div className="mb-2">
                            <Label htmlFor="speaker" value={t('create.form.speaker')}/>
                        </div>
                        <TextInput id="speaker" type="text" required
                                   color={speakerError ? 'failure' : undefined}
                                   value={speaker} onChange={e => setSpeaker(e.currentTarget.value)}
                                   helperText={speakerError ? t('create.form.titleError') : null}/>
                    </div>

                    <div className="w-full">
                        <div className="mb-2">
                            <Label htmlFor="host" value={t('create.form.host')}/>
                        </div>
                        <TextInput id="host" type="text" required
                                   color={hostError ? 'failure' : undefined}
                                   value={host} onChange={e => setHost(e.currentTarget.value)}
                                   helperText={hostError ? t('create.form.titleError') : null}/>
                    </div>

                    <div className="w-full">
                        <div className="mb-2">
                            <Label htmlFor="date" value={t('create.form.date')}/>
                        </div>
                        <TextInput id="date" type="text" required
                                   color={dateError ? 'failure' : undefined}
                                   placeholder="2008-01-01"
                                   value={date} onChange={e => setDate(e.currentTarget.value)}
                                   helperText={dateError ? t('create.form.dateError') : null}/>
                    </div>
                </div>
                <Button color="blue" disabled={loading} className="w-full" onClick={submit}
                        fullSized>{t('create.continue')}</Button>
            </div>
            <div className="hidden xl:flex justify-center items-center h-full">
                <img src="/assets/illustrations/education-light.png" className="dark:hidden w-96" alt=""/>
                <img src="/assets/illustrations/education-dark.png" className="hidden dark:block w-96" alt=""/>
            </div>
        </div>
    </div>
}
