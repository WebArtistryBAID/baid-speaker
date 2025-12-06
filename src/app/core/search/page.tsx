import {redirect} from 'next/navigation'
import CoreSearchClient from '@/app/core/search/CoreSearchClient'
import {searchPublicLectures} from '@/app/lib/lecture-actions'
import { CookiesProvider } from 'react-cookie'

export default async function CoreSearchBase(
    props: {
        searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
    }
) {
    const searchParams = await props.searchParams;
    if (searchParams == null) {
        redirect('/core')
    }
    const q = (await searchParams).q
    const query = (q == null ? '' : (q as string)).trim()
    return <CookiesProvider><CoreSearchClient lectures={await searchPublicLectures(0, query)}
                                              uploadServePath={`/${process.env.UPLOAD_SERVE_PATH}/`} query={query}/></CookiesProvider>
}
