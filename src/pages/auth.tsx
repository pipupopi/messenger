import { requestData } from '@/request';
import { container, modalWrapper } from '@/styles';
import {
    COOKIES_KEY,
    EMPTY_STRING,
    PAGES_HREF,
    REGEX,
    REQUEST,
    THEME_KEY,
    TIMEOUT,
    UI_ERROR_MESSAGE,
} from '@/utils/const';
import { setCookie } from '@/utils/getCookie';
import LoginIcon from '@mui/icons-material/Login';
import ReplyIcon from '@mui/icons-material/Reply';
import {
    Alert,
    Box,
    Button,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import { MESSAGES } from './chat';

function Auth() {
    const [reqError, setReqError] = useState({
        error: false,
        text: EMPTY_STRING,
    });
    const [token, setToken] = useState(EMPTY_STRING);
    const router = useRouter();
    const [theme, setTheme] = useState<string>();

    useEffect(() => {
        setTheme(localStorage.getItem(THEME_KEY) ?? EMPTY_STRING);
    }, []);

    async function auth() {
        try {
            if (token) {
                const result = await requestData(
                    REQUEST.URL.USER,
                    REQUEST.METHOD.GET,
                    token
                );
                result.ok
                    ? enterChat(await result.json())
                    : showError(UI_ERROR_MESSAGE.TOKEN);
            }
        } catch (error) {
            throw error;
        }
    }

    function enterChat(data: MESSAGES[]) {
        setCookie(COOKIES_KEY.TOKEN, token);
        setCookie(COOKIES_KEY.USER_DATA, data);
        router.push(PAGES_HREF.CHAT);
    }

    function showError(errorText: string) {
        setReqError({ error: true, text: errorText });
        setTimeout(
            () => setReqError({ error: false, text: EMPTY_STRING }),
            TIMEOUT.ERROR
        );
    }

    function hasCyrillicSymbols(text: string) {
        REGEX.CYRILLIC.test(text) ? auth() : showError(UI_ERROR_MESSAGE.CYRILLIC);
    }

    return (
        <Box
            sx={{
                ...container,
                ...(theme ? { backgroundImage: `url(${theme})` } : {}),
            }}
        >
            <Box sx={modalWrapper}>
                <Typography
                    color="primary"
                    sx={{ fontSize: '41px', textAlign: 'center' }}
                >
                    Confirmation
                </Typography>
                <form
                    onSubmit={(event: FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        hasCyrillicSymbols(token);
                    }}
                >
                    <TextField
                        onChange={(event) => setToken(event.target.value)}
                        size="small"
                        label={'Enter a code...'}
                        sx={{
                            '& .MuiOutlinedInput-input': {
                                color: 'grey',
                            },
                        }}
                        focused
                        fullWidth
                        inputProps={{
                            autoComplete: 'off',
                        }}
                    />
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: '20px' }}
                        endIcon={<LoginIcon />}
                        type="submit"
                    >
                        Enter
                    </Button>
                </form>
                <Link href={PAGES_HREF.MAIN}>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: '5px' }}
                        endIcon={<ReplyIcon />}
                        type="submit"
                    >
                        Back
                    </Button>
                </Link>
                {reqError.error ? (
                    <Stack sx={{ width: '100%', mt: '10px' }}>
                        <Alert severity="error">{reqError.text}</Alert>
                    </Stack>
                ) : null}
            </Box>
        </Box>
    );
}

export default Auth;
