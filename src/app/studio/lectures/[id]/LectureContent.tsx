'use client'

import { HydratedLecture } from '@/app/lib/lecture-actions'
import { useTranslationClient } from '@/app/i18n/client'
import If from '@/app/lib/If'
import { HiDownload, HiPencilAlt } from 'react-icons/hi'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card } from 'flowbite-react'
import Link from 'next/link'

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

        <a className="block flex-grow" href={`${uploadServePath}${name}`}>
            <img src={`${uploadServePath}${name}`} alt={t(`lecture.content.${target}`)}
                 className="w-full h-auto rounded-t-3xl"/>
        </a>
        <div className="flex w-full p-5 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-b-3xl">
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
                <a download href={`${uploadServePath}${name}`} className="btn-icon-only"
                   aria-label={t('lecture.content.open')}>
                    <HiDownload className="text-xl"/>
                </a>
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
        <div
            className="bg-sky-50 dark:bg-sky-900 dark:text-white w-full text-center flex flex-col justify-center items-center rounded-t-3xl flex-grow">
            <p>{t('lecture.content.slidesView')}</p>
        </div>
        <div className="flex w-full p-5 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-b-3xl">
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
                <a download href={`${uploadServePath}${lecture.uploadedSlides}`} className="btn-icon-only"
                   aria-label={t('lecture.content.open')}>
                    <HiDownload className="text-xl"/>
                </a>
            </div>
        </div>
    </div>
}

export default function LectureContent({ lecture, uploadServePath }: {
    lecture: HydratedLecture,
    uploadServePath: string
}) {
    const { t } = useTranslationClient('studio')

    return <>
        <If condition={lecture.uploadedPoster == null && lecture.uploadedVideo == null && lecture.uploadedFeedback == null && lecture.uploadedSlides == null && lecture.uploadedGroupQR == null}>
            <div className="w-full flex flex-col justify-center items-center">
                <img src="/assets/illustrations/media-light.png" className="dark:hidden w-72 mb-3" alt=""/>
                <img src="/assets/illustrations/media-dark.png" className="hidden dark:block w-72 mb-3" alt=""/>
                <p>{t('lecture.content.empty')}</p>
            </div>
        </If>
        <If condition={!(lecture.uploadedPoster == null && lecture.uploadedVideo == null && lecture.uploadedFeedback == null && lecture.uploadedSlides == null && lecture.uploadedGroupQR == null)}>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-8">
                <If condition={lecture.uploadedPoster != null}>
                    <ImageCard lecture={lecture} uploadServePath={uploadServePath} name={lecture.uploadedPoster!}
                               target="poster"/>
                </If>

                <If condition={lecture.uploadedSlides != null}>
                    <SlidesCard lecture={lecture} uploadServePath={uploadServePath}/>
                </If>

                <If condition={lecture.uploadedGroupQR != null}>
                    <ImageCard lecture={lecture} uploadServePath={uploadServePath} name={lecture.uploadedGroupQR!}
                               target="groupQR"/>
                </If>

                <If condition={lecture.uploadedFeedback != null}>
                    <ImageCard lecture={lecture} uploadServePath={uploadServePath} name={lecture.uploadedFeedback!}
                               target="feedback"/>
                </If>

                <If condition={lecture.uploadedVideo != null}>
                    <Card className="col-span-1 h-full w-full relative">
                        <h2>{t('lecture.content.videoTitle')}</h2>
                        <p className="secondary">{t('lecture.content.videoMessage')}</p>
                        <Button as={Link} color="blue" href={`/watch/${lecture.id}`}>
                            {t('lecture.content.videoCta')}
                        </Button>
                    </Card>
                </If>
            </div>
        </If>
    </>
}
