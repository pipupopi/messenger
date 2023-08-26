import MessageList from '@/Components/messages/list-message';
import { checkUserReq, requestData } from '@/request';
import { container, formBlock } from '@/styles';
import {
    COOKIES_KEY,
    EMPTY_STRING,
    MAX_SYMBOLS_VALUE,
    PAGES_HREF,
    REQUEST,
    THEME_KEY,
    TIMEOUT,
} from '@/utils/const';
import { getCookie } from '@/utils/getCookie';
import { Login, Send, Settings } from '@mui/icons-material';
import {
    Box,
    Button,
    FormHelperText,
    IconButton,
    TextField,
} from '@mui/material';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

export interface MESSAGES {
    createdAt: string;
    text: string;
    updateAt: string;
    user: {
        email: string;
        name: string;
    };
    ___v: number;
    _id: string;
}

function Chat() {
    const [messages, setMessages] = useState<MESSAGES[]>([]);
    const token = getCookie(COOKIES_KEY.TOKEN);
    const router = useRouter();
    const [textMessage, setTextMessage] = useState(EMPTY_STRING);
    const [theme, setTheme] = useState<string>();
    const [socket, setSocket] = useState<WebSocket>(
        new WebSocket(`wss://edu.strada.one/websockets?${token}`)
    );

    useEffect(() => {
        const checkUser = async () => {
            (await checkUserReq(token)) ? null : router.push(PAGES_HREF.MAIN);
        };

        checkUser();
    }, [router, token]);

    const connect = useCallback(() => {
        const newSocket = new WebSocket(
            `wss://edu.strada.one/websockets?${token}`
        );
        setSocket(newSocket);
    }, [token]);

    useEffect(() => {
        try {
            if (token) {
                const getMessages = async () => {
                    const response = await requestData(
                        REQUEST.URL.MESSAGES,
                        REQUEST.METHOD.GET,
                        token
                    );
                    const result = await response.json();
                    setMessages(result.messages);
                };
                getMessages();
            }
            setTheme(localStorage.getItem(THEME_KEY) ?? EMPTY_STRING);
        } catch (error) {
            console.error(error);
        }
    }, [token]);

    useEffect(() => {
        try {
            socket.onopen = () => {
                socket.onmessage = (event) => {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        JSON.parse(event.data),
                    ]);
                };
            };
            socket.onclose = () => {
                setTimeout(connect, TIMEOUT.CONNECT);
            };
        } catch (error) {
            console.error(error);
        }
    }, [socket, connect]);

    function sendMessage(text: string | number) {
        socket.send(JSON.stringify({ text }));
        setTextMessage(EMPTY_STRING);
    }

    return (
        <Box
            sx={{
                ...(theme ? { backgroundImage: `url(${theme})` } : {}),
                ...container,
            }}
        >
            <Box
                sx={{
                    width: '1000px',
                    mt: '35px',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        maxWidth: '100%',
                    }}
                >
                    <Link href={PAGES_HREF.SETTINGS}>
                        <Button variant="contained" endIcon={<Settings />}>
                            Settings
                        </Button>
                    </Link>
                    <Link href={PAGES_HREF.MAIN}>
                        <Button
                            variant="contained"
                            endIcon={<Login />}
                            onClick={() => Cookies.remove(COOKIES_KEY.TOKEN)}
                        >
                            Exit
                        </Button>
                    </Link>
                </Box>
                <MessageList data={messages} />
                <form
                    onSubmit={(event: any) => {
                        event.preventDefault();
                        textMessage && sendMessage(textMessage);
                    }}
                >
                    <Box sx={formBlock}>
                        <TextField
                            size="small"
                            label="Enter a message..."
                            variant="outlined"
                            sx={{
                                mt: '5px',
                                fontSize: '100px',
                            }}
                            fullWidth
                            onChange={(event) => {
                                setTextMessage(event.target.value);
                            }}
                            value={textMessage}
                            inputProps={{
                                maxLength: MAX_SYMBOLS_VALUE,
                                autoComplete: 'off',
                            }}
                        />
                        <FormHelperText sx={{ mt: '15px', ml: '5px' }}>
                            {MAX_SYMBOLS_VALUE - textMessage.length}/
                            {MAX_SYMBOLS_VALUE}
                        </FormHelperText>
                        <IconButton color="primary">
                            <Send fontSize="small" sx={{ ml: '5px' }} />
                        </IconButton>
                    </Box>
                </form>
            </Box>
        </Box>
    );
}

export default Chat;
