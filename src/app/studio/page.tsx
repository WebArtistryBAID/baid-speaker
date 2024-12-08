import { serverTranslation } from '@/app/i18n'
import { Button, Card } from 'flowbite-react'
import { HiAnnotation, HiArrowRight } from 'react-icons/hi'
import { Trans } from 'react-i18next/TransWithoutContext'

export default async function StudioHome() {
    const { t } = await serverTranslation('studio')

    return <div className="base-studio-page">
        <h1 className="mb-8">{t('nav.dashboard')}</h1>
        <h2 className="mb-5">{t('dashboard.onboarding')}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-8">
            <Card className="col-span-2">
                <h2>{t('dashboard.createCard.title')}</h2>
                <p className="secondary xl:mb-6">{t('dashboard.createCard.subtitle')}</p>
                <Button>
                    {t('dashboard.createCard.cta')}
                    <HiArrowRight className="btn-guide-icon"/>
                </Button>
            </Card>
            <Card className="col-span-1">
                <h2>{t('dashboard.tutorialCard.title')}</h2>
                <p className="secondary">{t('dashboard.tutorialCard.subtitle')}</p>
                <Button color="blue">
                    {t('dashboard.tutorialCard.cta')}
                    <HiArrowRight className="btn-guide-icon"/>
                </Button>
            </Card>
            <Card className="col-span-1 hidden 2xl:block">
                <h2>{t('dashboard.watchCard.title')}</h2>
                <p className="secondary">{t('dashboard.watchCard.subtitle')}</p>
                <Button color="warning">
                    {t('dashboard.watchCard.cta')}
                    <HiArrowRight className="btn-guide-icon"/>
                </Button>
            </Card>
        </div>

        <h2 className="mb-1">{t('dashboard.upcoming.title')}</h2>
        <h3 className="mb-5 font-normal">The History of Artificial Intelligence: From Dartmouth Workshop to ChatGPT</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-8">
            <Card className="col-span-1">
                <p className="secondary text-sm font-display">{t('dashboard.upcoming.status')}</p>
                <div className="flex flex-col w-full justify-center items-center">
                    <HiAnnotation className="text-7xl text-blue-500"/>
                    <p>Assigned to Host</p>
                </div>
                <Button color="blue">
                    {t('dashboard.upcoming.viewDetails')}
                    <HiArrowRight className="btn-guide-icon"/>
                </Button>
            </Card>
            <Card className="col-span-2">
                <p className="secondary text-sm font-display">{t('dashboard.upcoming.nextDue.title')}</p>
                <p className="text-3xl font-display"><Trans t={t} i18nKey="dashboard.upcoming.nextDue.template"
                                                            values={{
                                                                action: 'submit your presentation',
                                                                day: 'Friday'
                                                            }}
                                                            components={{
                                                                1: <span className="font-bold text-yellow-400"/>
                                                            }}/></p>
                <Button color="warning">
                    {t('dashboard.upcoming.nextDue.cta')}
                    <HiArrowRight className="btn-guide-icon"/>
                </Button>
            </Card>
            <Card className="col-span-1">
                <div className="flex flex-col w-full justify-center items-center h-full">
                    <p className="text-7xl mb-3 font-display font-bold text-blue-500">5</p>
                    <p>{t('dashboard.upcoming.lectureIn')}</p>
                </div>
            </Card>
        </div>

        <h2 className="mb-5">{t('dashboard.statistics.title')}</h2>
    </div>
}
