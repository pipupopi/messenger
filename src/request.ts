import { REQUEST, COOKIES_KEY } from './utils/const';

export async function authReq(email: string, url: string) {
    try {
        const result = await fetch(url, {
            method: REQUEST.METHOD.POST,
            headers: REQUEST.HEADERS.DEFAULT_HEADERS,
            body: JSON.stringify({ email }),
        });
        return result;
    } catch (error: unknown) {
        throw error;
    }
}

export async function changeNameReq(name: string, url: string, token: string) {
    try {
        const result = await fetch(url, {
            method: REQUEST.METHOD.PATCH,
            headers: {
                ...REQUEST.HEADERS.DEFAULT_HEADERS,
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name }),
        });
        return result;
    } catch (error) {
        throw error;
    }
}

export async function requestData(url: string, method: string, token: string) {
    try {
        const result = await fetch(url, {
            method: method,
            headers: {
                ...REQUEST.HEADERS.DEFAULT_HEADERS,
                Authorization: `Bearer ${token}`,
            },
        });
        return result;
    } catch (err) {
        throw err;
    }
}

export async function checkUserReq(token: string) {
    try {
        const result = await fetch(REQUEST.URL.USER, {
            method: REQUEST.METHOD.GET,
            headers: {
                ...REQUEST.HEADERS.DEFAULT_HEADERS,
                Authorization: `Bearer ${token}`,
            },
        });
        return result.ok;
    } catch (err) {
        throw err;
    }
}
