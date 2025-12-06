import CoreClient from '@/app/core/CoreClient'
import {getPublicLectures} from '@/app/lib/lecture-actions'
import SimpleNav from '@/app/core/SimpleNav'
import { CookiesProvider } from 'react-cookie'

export default async function CoreBase() {
    return <>
        <SimpleNav/>
        <CookiesProvider><CoreClient lectures={await getPublicLectures(0)} uploadServePath={`/${process.env.UPLOAD_SERVE_PATH}/`}/></CookiesProvider>
    </>
}
