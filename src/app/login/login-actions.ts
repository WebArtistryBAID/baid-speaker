'use server'

import { Lecture, NotificationType, PrismaClient, User } from '@prisma/client'
import { me } from '@/app/login/login'
import { Paginated } from '@/app/lib/lecture-actions'
import { decodeJwt } from 'jose'

const prisma = new PrismaClient()

export interface HydratedNotification {
    id: number
    createdAt: Date
    type: NotificationType
    userId: number
    lecture: Lecture | null
    lectureId: number | null
    values: string[]
}

export async function getLoginTarget(redirect: string): Promise<string> {
    // We are really abusing state here... But it works.
    return `${process.env.ONELOGIN_HOST}/oauth2/authorize?client_id=${process.env.ONELOGIN_CLIENT_ID}&redirect_uri=${process.env.HOST}/login/authorize&scope=basic+phone&response_type=code&state=${redirect}`
}

export async function requireUser(): Promise<User> {
    const user = await getMyUser()
    if (!user) {
        throw new Error('Unauthorized')
    }
    return user
}

export async function requireUserPermission(permission: string): Promise<User> {
    const user = await requireUser()
    if (!user.permissions.includes(permission)) {
        throw new Error('Unauthorized')
    }
    return user
}

export async function getMyUser(): Promise<User | null> {
    const id = await me()
    if (id == null) {
        return null
    }
    return prisma.user.findUnique({
        where: { id }
    })
}

export async function getUser(id: number): Promise<User | null> {
    await requireUserPermission('admin.manage')
    return prisma.user.findUnique({
        where: { id }
    })
}

export async function toggleUserPermission(id: number, permission: string): Promise<void> {
    await requireUserPermission('admin.manage')
    const user = await prisma.user.findUnique({
        where: { id }
    })
    if (!user) {
        return
    }
    if (user.permissions.includes(permission)) {
        await prisma.user.update({
            where: { id },
            data: {
                permissions: {
                    set: user.permissions.filter(p => p !== permission)
                }
            }
        })
    } else {
        await prisma.user.update({
            where: { id },
            data: {
                permissions: {
                    set: [ ...user.permissions, permission ]
                }
            }
        })
    }
}

export async function getUsers(page: number, keyword: string): Promise<Paginated<User>> {
    await requireUserPermission('admin.manage')
    const pages = Math.ceil(await prisma.user.count({
        where: {
            OR: [
                { name: { contains: keyword } },
                { pinyin: { contains: keyword } }
            ]
        }
    }) / 10)
    const users = await prisma.user.findMany({
        where: {
            OR: [
                { name: { contains: keyword } },
                { pinyin: { contains: keyword } }
            ]
        },
        skip: page * 10,
        take: 10
    })
    return {
        items: users,
        page,
        pages
    }
}

export async function getAccessToken(): Promise<string | null> {
    const id = await me()
    if (id == null) {
        return null
    }
    const user = await prisma.user.findUnique({
        where: {
            id
        },
        include: {
            oaTokens: true
        }
    })
    if (!user) {
        return null
    }
    const access = user.oaTokens!.accessToken
    const refresh = user.oaTokens!.refreshToken
    // Check if token has expired, if so refresh
    const decoded = decodeJwt(access)
    if (decoded.exp! * 1000 < Date.now()) {
        const response = await fetch(`${process.env.ONELOGIN_HOST}/oauth2/token`, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${Buffer.from(`${process.env.ONELOGIN_CLIENT_ID}:${process.env.ONELOGIN_CLIENT_SECRET}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refresh
            }).toString()
        })
        const json = await response.json()
        if ('error' in json) {
            return null
        }
        await prisma.oATokens.update({
            where: {
                userId: user.id
            },
            data: {
                accessToken: json['access_token'],
                refreshToken: json['refresh_token']
            }
        })
        return json['access_token']
    }
    return access
}

export async function toggleInboxNotification(type: NotificationType): Promise<void> {
    const user = await requireUser()
    if (user.inboxNotifications.includes(type)) {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                inboxNotifications: {
                    set: user.inboxNotifications.filter(t => t !== type)
                }
            }
        })
    } else {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                inboxNotifications: {
                    set: [ ...user.inboxNotifications, type ]
                }
            }
        })
    }
}

export async function toggleSMSNotification(type: NotificationType): Promise<void> {
    const user = await requireUser()
    if (user.smsNotifications.includes(type)) {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                smsNotifications: {
                    set: user.smsNotifications.filter(t => t !== type)
                }
            }
        })
    } else {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                smsNotifications: {
                    set: [ ...user.smsNotifications, type ]
                }
            }
        })
    }
}

export async function getMyNotificationsCount(): Promise<number> {
    const user = await requireUser()
    return prisma.notification.count({ where: { userId: user.id } })
}

export async function getMyNotifications(page: number): Promise<Paginated<HydratedNotification>> {
    const user = await requireUser()
    const pages = Math.ceil(await prisma.notification.count({ where: { userId: user.id } }) / 10)
    const notifications = await prisma.notification.findMany({
        where: {
            userId: user.id
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            lecture: true
        },
        skip: page * 10,
        take: 10
    })
    return {
        items: notifications,
        page,
        pages
    }
}

export async function dismissNotification(id: number): Promise<void> {
    const user = await requireUser()
    await prisma.notification.delete({
        where: {
            id,
            userId: user.id
        }
    })
}
