'use client'

import { HydratedLecture, submitVideo } from '@/app/lib/lecture-actions'
import { useTranslationClient } from '@/app/i18n/client'
import If from '@/app/lib/If'
import { HiDownload, HiPencilAlt } from 'react-icons/hi'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, TextInput } from 'flowbite-react'
import { Trans } from 'react-i18next/TransWithoutContext'

function ImageCard({ lecture, uploadServePath, name, target }: {
    lecture: HydratedLecture,
    uploadServePath: string,
    name: string,
    target: string
}) {
    const { t } = useTranslationClient('studio')

    const [ loading, setLoading ] = useState(false)
    const [ complete, setComplete ] = useState(false)
    const [ progress, setProgress ] = useState(0)
    const [ error, setError ] = useState(false)
    const ref = useRef<HTMLInputElement | null>(null)
    const router = useRouter()

    function upload() {
        setComplete(false)
        setProgress(0)
        setError(false)

        const formData = new FormData()
        formData.append('file', ref.current!.files![0])
        formData.append('target', target)

        setLoading(true)
        const xhr = new XMLHttpRequest()
        xhr.open('POST', `/studio/lectures/${lecture.id}/upload`, true)
        xhr.upload.onprogress = (e: ProgressEvent) => {
            if (e.lengthComputable) {
                setProgress(Math.round((e.loaded / e.total) * 100))
            }
        }
        xhr.onload = () => {
            setLoading(false)
            setProgress(0)
            if (xhr.status === 200) {
                setComplete(true)
                router.refresh()
            } else {
                setError(true)
            }
        }
        xhr.onerror = () => {
            setError(true)
        }

        xhr.send(formData)
    }

    return <div className="col-span-1 h-full w-full flex flex-col">
        <input type="file" onChange={upload} accept="image/*" className="hidden" ref={ref}/>

        <If condition={name != null}>
            <a className="block flex-grow" href={`${uploadServePath}${name}`}>
                <img src={`${uploadServePath}${name}`} alt={t(`lecture.content.${target}`)}
                     className="w-full h-auto rounded-3xl"/>
            </a>
        </If>
        <div className="flex w-full p-5 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-3xl">
            <p className="text-xl font-display mr-auto">
                <If condition={loading}>
                    {progress}%
                </If>
                <If condition={error}>
                    {t('lecture.content.error')}
                </If>
                <If condition={complete}>
                    {t('lecture.content.done')}
                </If>
                <If condition={!loading && !error && !complete}>
                    {t(`lecture.content.${target}`)}
                </If>
            </p>
            <div className="flex gap-3">
                <button className="btn-icon-only" aria-label={t('lecture.content.edit')} disabled={loading}
                        onClick={() => ref.current?.click()}>
                    <HiPencilAlt className="text-xl"/>
                </button>
                <If condition={name != null}>
                    <a download href={`${uploadServePath}${name}`} className="btn-icon-only"
                       aria-label={t('lecture.content.open')}>
                        <HiDownload className="text-xl"/>
                    </a>
                </If>
            </div>
        </div>
    </div>
}

function SlidesCard({ lecture, uploadServePath }: { lecture: HydratedLecture, uploadServePath: string }) {
    const { t } = useTranslationClient('studio')

    const [ loading, setLoading ] = useState(false)
    const [ complete, setComplete ] = useState(false)
    const [ progress, setProgress ] = useState(0)
    const [ error, setError ] = useState(false)
    const ref = useRef<HTMLInputElement | null>(null)
    const router = useRouter()

    function upload() {
        setComplete(false)
        setProgress(0)
        setError(false)

        const formData = new FormData()
        formData.append('file', ref.current!.files![0])
        formData.append('target', 'slides')

        setLoading(true)
        const xhr = new XMLHttpRequest()
        xhr.open('POST', `/studio/lectures/${lecture.id}/upload`, true)
        xhr.upload.onprogress = (e: ProgressEvent) => {
            if (e.lengthComputable) {
                setProgress(Math.round((e.loaded / e.total) * 100))
            }
        }
        xhr.onload = () => {
            setLoading(false)
            setProgress(0)
            if (xhr.status === 200) {
                setComplete(true)
                router.refresh()
            } else {
                setError(true)
            }
        }
        xhr.onerror = () => {
            setError(true)
        }

        xhr.send(formData)
    }

    return <div className="col-span-1 h-full w-full flex flex-col">
        <input type="file" onChange={upload}
               accept="application/x-iwork-keynote-sffkey,application/pdf,application/vnd.ms-powerpoint,text/plain,text/html,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint.presentation.macroEnabled.12,application/vnd.openxmlformats-officedocument.presentationml.slideshow,application/vnd.ms-pps"
               className="hidden" ref={ref}/>
        <If condition={lecture.uploadedSlides != null}>
            <div
                className="bg-sky-50 dark:bg-sky-900 dark:text-white w-full text-center flex flex-col justify-center items-center rounded-3xl flex-grow">
                <p>{t('lecture.content.slidesView')}</p>
            </div>
        </If>
        <div className="flex w-full p-5 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-3xl">
            <p className="text-xl font-display mr-auto">
                <If condition={loading}>
                    {progress}%
                </If>
                <If condition={error}>
                    {t('lecture.content.error')}
                </If>
                <If condition={complete}>
                    {t('lecture.content.done')}
                </If>
                <If condition={!loading && !error && !complete}>
                    {t('lecture.content.slides')}
                </If>
            </p>
            <div className="flex gap-3">
                <button className="btn-icon-only" aria-label={t('lecture.content.edit')} disabled={loading}
                        onClick={() => ref.current?.click()}>
                    <HiPencilAlt className="text-xl"/>
                </button>
                <If condition={lecture.uploadedSlides != null}>
                    <a download href={`${uploadServePath}${lecture.uploadedSlides}`} className="btn-icon-only"
                       aria-label={t('lecture.content.open')}>
                        <HiDownload className="text-xl"/>
                    </a>
                </If>
            </div>
        </div>
    </div>
}

export default function LectureContent({ lecture, uploadServePath }: {
    lecture: HydratedLecture,
    uploadServePath: string
}) {
    const { t } = useTranslationClient('studio')
    const [ open, setOpen ] = useState(false)
    const [ error, setError ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const [ video, setVideo ] = useState('')
    const router = useRouter()

    return <>
        <Modal show={open} onClose={() => setOpen(false)}>
            <ModalHeader>{t('tasks.submitVideo.name')}</ModalHeader>
            <ModalBody>
                <p className="mb-3"><Trans t={t} i18nKey="tasks.submitReflection.modalDescription"
                                           components={{
                                               1: <span className="font-bold" key={123}/>,
                                               2: <a href="https://youtube.com/upload" className="inline"
                                                     key={256}/>
                                           }}/></p>
                <TextInput type="text" required
                           color={error ? 'failure' : undefined}
                           value={video} onChange={e => setVideo(e.currentTarget.value)}
                           helperText={error ? t('tasks.submitVideo.inputError') : null}/>
            </ModalBody>
            <ModalFooter>
                <Button color="blue" disabled={loading} onClick={async () => {
                    setError(false)
                    try {
                        const url = new URL(video)
                        if (url.host !== 'www.youtube.com' && url.host !== 'youtu.be' && url.host !== 'youtube.com') {
                            setError(true)
                            return
                        }
                        if ((url.host === 'www.youtube.com' || url.host === 'youtube.com') && !url.searchParams.has('v')) {
                            setError(true)
                            return
                        }
                    } catch {
                        setError(true)
                        return
                    }

                    setLoading(true)
                    await submitVideo(lecture.id, video.replace('http://', 'https://'))
                    router.refresh()
                    setOpen(false)
                }}>
                    {t('tasks.submitVideo.cta')}
                </Button>
                <Button color="gray" onClick={() => setOpen(false)}>
                    {t('cancel')}
                </Button>
            </ModalFooter>
        </Modal>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-8">
            <ImageCard lecture={lecture} uploadServePath={uploadServePath} name={lecture.uploadedPoster!}
                       target="poster"/>

            <SlidesCard lecture={lecture} uploadServePath={uploadServePath}/>

            <ImageCard lecture={lecture} uploadServePath={uploadServePath} name={lecture.uploadedGroupQR!}
                       target="groupQR"/>

            <ImageCard lecture={lecture} uploadServePath={uploadServePath} name={lecture.uploadedFeedback!}
                       target="feedback"/>
        </div>

        <Button color="blue" pill
                className="flex justify-center items-center" onClick={() => setOpen(true)}>
            {t('lecture.content.videoCta')}
        </Button>
    </>
}
