import Cookies from 'js-cookie';
import { ERROR_MESSAGE } from './const';

export function setCookie(key: string, value: unknown) {
    try {
        Cookies.set(key, JSON.stringify(value));
    } catch (error) {
        throw new Error(ERROR_MESSAGE.STRINGIFY);
    }
}

export function getCookie(key: string) {
    const jsonCookies = Cookies.get(key);
    if (jsonCookies) {
        try {
            return JSON.parse(jsonCookies);
        } catch (err) {
            throw new Error(ERROR_MESSAGE.PARSE);
        }
    }
    return null;
}
