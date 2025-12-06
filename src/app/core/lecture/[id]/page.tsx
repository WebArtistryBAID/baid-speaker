import { getLecture } from '@/app/lib/lecture-actions'
import CoreLectureClient from '@/app/core/lecture/[id]/CoreLectureClient'
import { redirect } from 'next/navigation'
import SimpleNav from '@/app/core/SimpleNav'
import { CookiesProvider } from 'react-cookie'

export default async function CoreLectureBase({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id
    const lecture = await getLecture(parseInt(id as string))
    if (lecture == null) {
        redirect('/core')
    }
    return <>
        <SimpleNav/>
        <CookiesProvider><CoreLectureClient lecture={lecture} uploadServePath={`/${process.env.UPLOAD_SERVE_PATH}/`}/></CookiesProvider>
    </>
}
