'use server'

export async function getLoginTarget(): Promise<string> {
    return `${process.env.ONELOGIN_HOST}/oauth2/authorize?client_id=${process.env.ONELOGIN_CLIENT_ID}&redirect_uri=${process.env.HOST}/login/authorize&scope=basic+phone&response_type=code`
}
