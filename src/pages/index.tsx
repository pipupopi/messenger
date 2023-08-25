import { authReq, checkUserReq } from '@/request';
import { container, modalWrapper } from '@/styles';
import {
    COOKIES_KEY,
    EMPTY_STRING,
    PAGES_HREF,
    REGEX,
    REQUEST,
    THEME_KEY,
    UI_ERROR,
} from '@/utils/const';
import { getCookie } from '@/utils/getCookie';
import SendIcon from '@mui/icons-material/Send';
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
import { useEffect, useState } from 'react';

export default function Home() {
    const [mail, setMail] = useState(EMPTY_STRING);
    const [reqStatus, setReqStatus] = useState({
        error: false,
        success: false,
        textError: EMPTY_STRING,
    });
    const router = useRouter();
    const token = getCookie(COOKIES_KEY.TOKEN);
    const [theme, setTheme] = useState<string>();

    useEffect(() => {
        const checkUser = async () => {
            (await checkUserReq(token)) && router.push(PAGES_HREF.CHAT);
        };
        checkUser();
        setTheme(localStorage.getItem(THEME_KEY) ?? EMPTY_STRING);
    }, [router, token]);

    async function getCode(mail: string) {
        try {
            const response = await authReq(mail, REQUEST.URL.EMAIL);
            setReqStatus({
                success: response.ok,
                error: !response.ok,
                textError: UI_ERROR.DEFAULT,
            });
        } catch (error) {
            console.error(error);
        }
    }

    async function validateMail(mail: string) {
        REGEX.MAIL.test(mail)
            ? getCode(mail)
            : setReqStatus({
                  success: false,
                  error: true,
                  textError: UI_ERROR.MAIL,
              });
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
                    Authorization
                </Typography>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        validateMail(mail);
                    }}
                >
                    <TextField
                        size="small"
                        label={'Enter your email'}
                        sx={{
                            '& .MuiOutlinedInput-input': {
                                color: 'grey',
                            },
                        }}
                        type="mail"
                        fullWidth
                        focused
                        onChange={(event) => setMail(event.target.value)}
                    />
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: '20px' }}
                        type="submit"
                    >
                        Get code
                    </Button>
                </form>
                <Link href={PAGES_HREF.AUTH}>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: '5px' }}
                        endIcon={<SendIcon />}
                    >
                        Enter code
                    </Button>
                </Link>
                <Stack sx={{ width: '100%', mt: '10px' }}>
                    {reqStatus.error ? (
                        <Alert severity="error">{reqStatus.textError}</Alert>
                    ) : reqStatus.success ? (
                        <Alert severity="success">The code in the mail!</Alert>
                    ) : null}
                </Stack>
            </Box>
        </Box>
    );
}
