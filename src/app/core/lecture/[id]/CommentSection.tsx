'use client'

import { useTranslationClient } from '@/app/i18n/client'
import { Trans } from 'react-i18next/TransWithoutContext'
import {
    deleteComment,
    getCommentsAmount,
    getTopLevelComments,
    HydratedComment,
    HydratedLecture,
    makeComment
} from '@/app/lib/lecture-actions'
import { useEffect, useRef, useState } from 'react'
import If from '@/app/lib/If'
import { Button, Spinner, TextInput } from 'flowbite-react'
import { useCachedUser } from '@/app/login/login-client'
import { HiTrash } from 'react-icons/hi'
import { getLoginTarget } from '@/app/login/login-actions'

function CommentBlock({ comment, remove }: { comment: HydratedComment, remove: () => void }) {
    const user = useCachedUser()
    const { t } = useTranslationClient('core')

    return <div className="flex items-center gap-3">
        <div className="btn-icon-only w-9 h-9" aria-label="User Icon">
            <span className="font-bold">{comment.user.name.at(0)}</span>
        </div>

        <div>
            <p>
                <span className="font-bold">{comment.user.name}</span>
                <span className="secondary ml-1 text-xs">{comment.createdAt.toLocaleString()}</span>
            </p>
            <p className="text-sm">{comment.content}</p>

            <If condition={user?.id === comment.userId || (user?.permissions ?? []).includes('admin.manage')}>
                <button aria-label={t('lecture.delete')} onClick={async () => {
                    await deleteComment(comment.id)
                    remove()
                }}>
                    <HiTrash className="text-sm text-red-500"/>
                </button>
            </If>
        </div>
    </div>
}

export default function CommentSection({ lecture }: { lecture: HydratedLecture }) {
    const { t } = useTranslationClient('core')

    const [ commentsAmount, setCommentsAmount ] = useState(0)
    const [ page, setPage ] = useState(0)
    const [ pages, setPages ] = useState(0)
    const [ loading, setLoading ] = useState(false)
    const [ comments, setComments ] = useState<HydratedComment[]>([])
    const [ newComment, setNewComment ] = useState('')
    const user = useCachedUser()
    const loaderRef = useRef<HTMLDivElement>(null)

    async function loadComments(pageToLoad: number) {
        setLoading(true)
        try {
            const paginated = await getTopLevelComments(lecture.id, pageToLoad)
            setComments(prev => [ ...prev, ...paginated.items ])
            setPages(paginated.pages)
        } catch (error) {
            console.error('Failed to load comments:', error)
        } finally {
            setLoading(false)
        }
    }

    async function comment() {
        if (user == null) {
            location.href = (await getLoginTarget(`/core/lecture/${lecture.id}`))
        }

        if (newComment.length > 0 && newComment.length < 128) {
            setLoading(true)
            const commentNew = await makeComment(lecture.id, newComment)
            setNewComment('')
            setLoading(false)
            setComments(prev => [ commentNew, ...prev ])
            setCommentsAmount(commentsAmount + 1)
        }
    }

    useEffect(() => {
        (async () => {
            setCommentsAmount(await getCommentsAmount(lecture.id))
            await loadComments(0)
        })()
    }, [ lecture.id ])

    useEffect(() => {
        if (!loaderRef.current || loading) return
        const current = loaderRef.current

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && page < pages - 1) {
                    setPage(prev => prev + 1)
                }
            },
            { threshold: 1.0 }
        )

        observer.observe(current)
        return () => {
            observer.unobserve(current)
        }
    }, [ loaderRef, page, pages, loading ])

    useEffect(() => {
        if (page === 0) return
        loadComments(page)
    }, [ page ])

    return <>
        <p className="font-display text-lg font-bold mb-3">
            <Trans t={t} i18nKey="lecture.comments" count={commentsAmount}/>
        </p>

        <div className="flex items-center gap-3 mb-2">
            <TextInput placeholder={t('lecture.commentPlaceholder')} type="text" value={newComment}
                       className="flex-grow" disabled={loading}
                       onClick={async () => {
                           if (user == null) {
                               location.href = (await getLoginTarget(`/core/lecture/${lecture.id}`))
                           }
                       }}
                       onChange={e => setNewComment(e.currentTarget.value)} onKeyUp={e => {
                if (e.key === 'Enter') {
                    comment()
                }
            }}/>
            <Button color="blue" pill onClick={comment}>{t('lecture.comment')}</Button>
        </div>
        <p className="text-xs secondary mb-5">{t('lecture.commentNotes')}</p>

        <div className="flex flex-col gap-5">
            {comments.map(comment => <CommentBlock key={comment.id} comment={comment} remove={() => {
                setComments(prev => prev.filter(c => c.id !== comment.id))
                setCommentsAmount(commentsAmount - 1)
            }}/>)}
        </div>

        <div ref={loaderRef} className="h-1"/>
        <If condition={loading}>
            <div className="w-full flex justify-center items-center">
                <Spinner color="blue"/>
            </div>
        </If>
    </>
}
