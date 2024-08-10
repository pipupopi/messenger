export const PAGES_HREF = {
    SETTINGS: './settings',
    CHAT: './chat',
    AUTH: './auth',
    MAIN: './',
};

export const REQUEST = {
    URL: {
        EMAIL: 'https://edu.strada.one/api/user',
        USER: 'https://edu.strada.one/api/user/me',
        MESSAGES: 'https://edu.strada.one/api/messages/',
    },
    METHOD: {
        POST: 'POST',
        PATCH: 'PATCH',
        GET: 'GET',
    },
    HEADERS: {
        DEFAULT_HEADERS: {
            'Content-Type': 'application/json; charset=utf-8',
        },
    },
};

export const COOKIES_KEY = {
    TOKEN: 'userToken',
    USER_DATA: 'userData',
    USER_NAME: 'userName',
};

export const THEME_KEY = 'themeUrl';

export const REGEX = {
    CYRILLIC: /^[\w.-]+$/,
    MAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
};

export const TIMEOUT = {
    ERROR: 1500,
    CONNECT: 3000,
};

export const ERROR_MESSAGE = {
    PARSE: 'Error while parsing JSON.parse',
    STRINGIFY: 'Error while parsing JSON.stringify',
};

export const UI_ERROR_MESSAGE = {
    DEFAULT: 'An error occurred...',
    CYRILLIC: 'The token cannot contain Russian characters',
    TOKEN: 'Invalid token has been entered',
    MAIL: 'Invalid mail has been introduced',
    NAME: 'The name must be longer than 3 characters',
};

export const UI_SUCCESS_MESSAGE = {
    TOKEN: 'The token in the mail!',
    NEW_NAME: 'Your name was successfully changed to',
};

export const EMPTY_STRING = '';
export const MAX_SYMBOLS_VALUE = 200;

export const SLICE_VALUES = {
    INITIAL: 0,
    INCREMENT: 20,
};
export const SCROLL_THRESHOLD = 20;
export const MAX_NAME_LENGTH = 2;
export const FORMAT_DATE_PARAMETRES = 'H:mm d/MM';
