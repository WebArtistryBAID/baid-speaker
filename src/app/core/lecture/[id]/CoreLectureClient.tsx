'use client'

import { countMyView, HydratedLecture, toggleLike } from '@/app/lib/lecture-actions'
import { useTranslationClient } from '@/app/i18n/client'
import {
    HiAcademicCap,
    HiBriefcase,
    HiPhotograph,
    HiPresentationChartBar,
    HiShare,
    HiSpeakerphone,
    HiThumbUp,
    HiUser,
    HiVideoCamera
} from 'react-icons/hi'
import { Button } from 'flowbite-react'
import If from '@/app/lib/If'
import { LectureStatus, User } from '@prisma/client'
import { useEffect, useState } from 'react'
import { getMyUser } from '@/app/login/login-actions'
import { useRouter } from 'next/navigation'
import { Trans } from 'react-i18next/TransWithoutContext'
import CommentSection from '@/app/core/lecture/[id]/CommentSection'

export default function CoreLectureClient({ lecture, uploadServePath }: {
    lecture: HydratedLecture,
    uploadServePath: string
}) {
    const { t } = useTranslationClient('core')
    const [ copied, setCopied ] = useState(false)
    const [ myUser, setMyUser ] = useState<User>()
    const [ loading, setLoading ] = useState(false)
    const router = useRouter()

    useEffect(() => {
        (async () => {
            setMyUser((await getMyUser())!)
            await countMyView(lecture.id)
        })()
    }, [ lecture.id ])

    function findSource(): string {
        if (lecture.uploadedVideo == null) {
            return 'about:blank'
        }

        try {
            const url = new URL(lecture.uploadedVideo)
            if (url == null) {
                return 'about:blank'
            }
            if (url.href.includes('youtube.com')) {
                return `https://www.youtube.com/embed/${url.searchParams.get('v')}?rel=0`
            }
            if (url.href.includes('youtu.be')) {
                return `https://www.youtube.com/embed/${url.pathname.slice(1)}?rel=0`
            }
        } catch {
            return 'about:blank'
        }
        return 'about:blank'
    }

    async function share() {
        // Use Web Share API whenever possible
        const data = {
            title: lecture.title,
            text: t('lecture.shareContent', { user: lecture.user.name }),
            url: location.toString()
        }
        if (navigator.canShare(data)) {
            await navigator.share(data)
        } else {
            await navigator.clipboard.writeText(location.toString())
            setCopied(true)
            setTimeout(() => {
                setCopied(false)
            }, 3000)
        }
    }

    async function like() {
        setLoading(true)
        await toggleLike(lecture.id)
        router.refresh()
        setLoading(false)
    }

    return <div className="base-studio-page">
        <h1 className="mb-8 text-xl lg:text-2xl xl:text-3xl">{lecture.title}</h1>
        <div className="flex flex-col lg:flex-row gap-5">
            <If condition={lecture.uploadedVideo != null}>
                <div className="lg:w-2/3 xl:w-3/4 w-full">
                    <div className="w-full rounded-3xl bg-gray-50 dark:bg-gray-800 mb-5 lg:mb-8">
                        <iframe src={findSource()} className="border-0 w-full aspect-video rounded-3xl"
                                allowFullScreen/>
                    </div>

                    <div className="w-full h-96 lg:h-auto overflow-y-auto">
                        <CommentSection lecture={lecture}/>
                    </div>
                </div>
            </If>
            <div
                className={lecture.uploadedVideo == null ? 'grid gap-5 grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' : 'w-full lg:w-1/3 xl:w-1/4 flex flex-col gap-5'}>
                <div className="rounded-3xl bg-gray-50 dark:bg-gray-800 p-8">
                    <div className="flex items-center mb-5">
                        <div className="bg-green-400 rounded-full h-12 w-12 flex justify-center items-center mr-5">
                            <HiSpeakerphone className="text-white text-2xl"/>
                        </div>
                        <div>
                            <p className="font-display text-xl font-bold">{lecture.user.name}</p>
                            <p className="font-display">{lecture.user.pinyin}</p>
                        </div>
                    </div>

                    <div className="flex items-center mb-3">
                        <div className="mr-3">
                            <div className="rounded-full flex justify-center items-center bg-blue-500 w-8 h-8">
                                <HiBriefcase className="text-white"/>
                            </div>
                        </div>
                        <p>{t('lecture.host')}<span
                            className="font-bold">{lecture.assignee?.name ?? t('lecture.notAssigned')}</span></p>
                    </div>

                    <div className="flex items-center mb-3">
                        <div className="mr-3">
                            <div className="rounded-full flex justify-center items-center bg-yellow-300 w-8 h-8">
                                <HiAcademicCap className="text-white"/>
                            </div>
                        </div>
                        <p>{t('lecture.teacher')}<span
                            className="font-bold">{lecture.assigneeTeacher?.name ?? t('lecture.notAssigned')}</span></p>
                    </div>

                    <div className="flex items-center mb-8">
                        <div className="mr-3">
                            <div className="rounded-full flex justify-center items-center bg-pink-500 w-8 h-8">
                                <HiPhotograph className="text-white"/>
                            </div>
                        </div>
                        <p>{t('lecture.poster')}<span
                            className="font-bold">{lecture.posterAssignee?.name ?? t('lecture.notAssigned')}</span></p>
                    </div>

                    <div className="flex w-full flex-wrap gap-3">
                        <Button pill color="light" aria-disabled><HiUser
                            className="btn-icon"/><Trans t={t} i18nKey="lecture.views"
                                                         count={lecture.viewedUsers.length}/></Button>
                        <Button pill disabled={loading}
                                color={lecture.likedUsers.includes(myUser?.id ?? -1) ? 'blue' : 'light'} onClick={like}>
                            <HiThumbUp className="btn-icon"/>
                            <Trans t={t} i18nKey="lecture.likes" count={lecture.likedUsers.length}/>
                            <If condition={lecture.likedUsers.includes(myUser?.id ?? -1)}>
                                <span className="sr-only">{t('lecture.youLiked')}</span>
                            </If>
                        </Button>
                        <Button pill color="light" onClick={share}><HiShare
                            className="btn-icon"/>{copied ? t('lecture.copied') : t('lecture.share')}</Button>
                    </div>
                </div>

                <If condition={lecture.uploadedSlides != null && lecture.slidesApproved}>
                    <div className="flex flex-col gap-5">
                        <a href={uploadServePath + lecture.uploadedSlides} download
                           className={`${lecture.uploadedVideo == null ? 'h-1/2' : ''} 
                           rounded-3xl bg-blue-500 hover:bg-blue-600 transition-colors duration-100 p-8 flex gap-5 items-center text-white`}>
                            <HiPresentationChartBar className="text-2xl w-1/4"/>
                            <div className="w-3/4">
                                <p className="font-display text-xl font-bold">{t('lecture.slides')}</p>
                                <p className="font-display text-sm">{t('lecture.slidesDownload')}</p>
                            </div>
                        </a>

                        <If condition={lecture.uploadedVideo == null}>
                            <div className="rounded-3xl bg-green-400 p-8 flex gap-5 items-center h-1/2 text-white">
                                <HiVideoCamera className="text-2xl w-1/4"/>
                                <div className="w-3/4">
                                    <p className="font-display text-xl font-bold">{t('lecture.video')}</p>
                                    <p className="font-display text-sm">{t('lecture.videoUpcoming')}</p>
                                </div>
                            </div>
                        </If>
                    </div>
                </If>

                <If condition={lecture.uploadedPoster != null && lecture.posterApproved}>
                    <div className="rounded-3xl bg-gray-50 dark:bg-gray-800 w-full">
                        <img src={uploadServePath + lecture.uploadedPoster} alt="Lecture Poster"
                             className="rounded-3xl w-full"/>
                    </div>
                </If>

                <If condition={lecture.uploadedGroupQR != null && lecture.status === LectureStatus.ready}>
                    <div className="rounded-3xl bg-gray-50 dark:bg-gray-800 w-full">
                        <img src={uploadServePath + lecture.uploadedGroupQR} alt="Lecture Group QR Code"
                             className="rounded-3xl w-full"/>
                    </div>
                </If>

                <div
                    className={`rounded-3xl bg-gray-50 dark:bg-gray-800 p-8 overflow-y-auto ${lecture.uploadedVideo == null ? 'h-full min-h-96' : 'max-h-96'}`}>
                    <p className="text-sm secondary font-display">{t('lecture.survey')}</p>
                    <p className="font-display font-bold">{t('lecture.preSurveyQ1')}</p>
                    <p className="mb-3">{lecture.preSurveyQ1}</p>

                    <p className="font-display font-bold">{t('lecture.preSurveyQ2')}</p>
                    <p className="mb-3">{lecture.preSurveyQ2}</p>
                </div>
            </div>
        </div>
    </div>
}
