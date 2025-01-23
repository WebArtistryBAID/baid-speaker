import CoreClient from '@/app/core/CoreClient'
import { getPublicLectures } from '@/app/lib/lecture-actions'

export default async function CoreBase() {
    return <CoreClient lectures={await getPublicLectures(0)} uploadServePath={`/${process.env.UPLOAD_SERVE_PATH}/`}/>
}
