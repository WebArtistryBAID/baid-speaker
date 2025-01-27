import CoreClient from '@/app/core/CoreClient'
import {getPublicLectures} from '@/app/lib/lecture-actions'
import SimpleNav from '@/app/core/SimpleNav'

export default async function CoreBase() {
    return <>
        <SimpleNav/>
        <CoreClient lectures={await getPublicLectures(0)} uploadServePath={`/${process.env.UPLOAD_SERVE_PATH}/`}/>
    </>
}
