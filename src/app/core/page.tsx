import CoreClient from '@/app/core/CoreClient'
import {getPublicLectures} from '@/app/lib/lecture-actions'
import SimpleNav from '@/app/core/SimpleNav'
import CookiesBoundary from '@/app/lib/CookiesBoundary'

export default async function CoreBase() {
    return <>
        <SimpleNav/>
        <CookiesBoundary><CoreClient lectures={await getPublicLectures(0)} uploadServePath={`/${process.env.UPLOAD_SERVE_PATH}/`}/></CookiesBoundary>
    </>
}
