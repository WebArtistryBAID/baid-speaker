import {getLogs, HydratedLecture, HydratedLectureAuditLog, Paginated} from '@/app/lib/lecture-actions'
import {useEffect, useState} from 'react'
import {Pagination, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from 'flowbite-react'
import {useTranslationClient} from '@/app/i18n/client'

export default function LectureHistory({lecture}: { lecture: HydratedLecture }) {
    const {t} = useTranslationClient('studio')
    const [currentPage, setCurrentPage] = useState(0)
    const [page, setPage] = useState<Paginated<HydratedLectureAuditLog> | null>(null)

    useEffect(() => {
        (async () => {
            setPage(await getLogs(lecture.id, currentPage))
        })()
    }, [currentPage, lecture.id])

    if (page == null) {
        return <div className="w-full">
            <div className="w-1/3 h-8 bg-gray-300 dark:bg-gray-700 rounded-3xl mb-3"/>
            <div className="w-1/2 h-8 bg-gray-300 dark:bg-gray-700 rounded-3xl mb-3"/>
            <div className="w-full h-8 bg-gray-300 dark:bg-gray-700 rounded-3xl mb-3"/>
        </div>
    }

    return <div>
        <Table className="mb-5">
            <TableHead>
                <TableHeadCell>{t('lecture.history.action')}</TableHeadCell>
                <TableHeadCell>{t('lecture.history.time')}</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y mb-3">
                {page.items.map(log => {
                    return <TableRow key={log.id} className="tr">
                        <TableCell className="th">{t(`lectureLogs.${log.type}`, {
                            ...log.values.map((v, i) => ({[`v${i}`]: v})),
                            user: log.user.name
                        })}</TableCell>
                        <TableCell>{log.time.toLocaleString()}</TableCell>
                    </TableRow>
                })}
            </TableBody>
        </Table>
        <div className="flex overflow-x-auto sm:justify-center">
            <Pagination currentPage={currentPage + 1} onPageChange={p => setCurrentPage(p - 1)}
                        totalPages={page.pages}/>
        </div>
    </div>
}
