import { changeNameReq, checkUserReq } from '@/request';
import { container, modalWrapper } from '@/styles';
import { checkValidateName } from '@/utils';
import {
    COOKIES_KEY,
    EMPTY_STRING,
    PAGES_HREF,
    REQUEST,
    THEME_KEY,
    UI_ERROR
} from '@/utils/const';
import { getCookie } from '@/utils/getCookie';
import { Close, ExpandMore } from '@mui/icons-material';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Box,
    Button,
    IconButton,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function Settings() {
    const router = useRouter();
    const token = getCookie(COOKIES_KEY.TOKEN);
    const dataUser = getCookie(COOKIES_KEY.USER_DATA);
    const [name, setName] = useState(EMPTY_STRING);
    const [imageTheme, setImageTheme] = useState<string | null>();
    const [reqStatus, setReqStatus] = useState({
        success: false,
        error: false,
        errorText: EMPTY_STRING,
    });

    useEffect(() => {
        const checkUser = async () => {
            (await checkUserReq(token)) ? null : router.push(PAGES_HREF.MAIN);
        };
        checkUser();
        setImageTheme(localStorage.getItem(THEME_KEY));
        dataUser && setName(dataUser.name);
    }, [dataUser, router, token]);

    function addTheme(image: File | undefined) {
        try {
            if (image) {
                const url = URL.createObjectURL(image);
                setImageTheme(url);
                localStorage.setItem(THEME_KEY, url);
            }
        } catch (error) {
            throw error;
        }
    }

    async function setValidateName(name: string) {
        checkValidateName(name)
            ? await changeName(name)
            : setReqStatus({
                  success: false,
                  error: true,
                  errorText: UI_ERROR.NAME,
              });
    }

    async function changeName(name: string) {
        try {
            const response = await changeNameReq(
                name,
                REQUEST.URL.EMAIL,
                token
            );
            setReqStatus({
                success: response.ok,
                error: !response.ok,
                errorText: UI_ERROR.DEFAULT,
            });
            const result = await response.json();
            Cookies.set(COOKIES_KEY.USER_NAME, JSON.stringify(result.name));
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Box
            sx={{
                ...container,
                ...(imageTheme
                    ? { backgroundImage: `url(${imageTheme})` }
                    : {}),
            }}
        >
            <Box sx={modalWrapper}>
                <Box
                    sx={{
                        width: '320px',
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography color="primary" sx={{ fontSize: '41px' }}>
                        Settings
                    </Typography>
                    <Link href={PAGES_HREF.CHAT}>
                        <IconButton color="primary">
                            <Close sx={{ mt: '10px' }} />
                        </IconButton>
                    </Link>
                </Box>
                <Box>
                    <Accordion sx={{ bgcolor: '#242424' }}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography color={'#5e55d6'}>
                            Add wallpaper to chat
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Button variant="contained" component="label">
                                Add
                                <input
                                    hidden
                                    type="file"
                                    accept="image/jpg, image/png, image/webp"
                                    onChange={(event) =>
                                        addTheme(event.target.files?.[0])
                                    }
                                />
                            </Button>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion sx={{ bgcolor: '#242424' }}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography color={'#5e55d6'}>
                                Change the name in the chat
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    setValidateName(name);
                                }}
                            >
                                <TextField
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    size="small"
                                    label={'Enter a new name'}
                                    sx={{
                                        '& .MuiOutlinedInput-input': {
                                            color: 'grey',
                                        },
                                        mt: '20px',
                                    }}
                                    fullWidth
                                    focused
                                    value={name}
                                />
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{ mt: '20px' }}
                                    type="submit"
                                >
                                   Change name
                                </Button>
                            </form>
                            <Stack sx={{ width: '100%', mt: '10px' }}>
                                {reqStatus.error ? (
                                    <Alert severity="error">
                                        {reqStatus.errorText}
                                    </Alert>
                                ) : reqStatus.success ? (
                                    <Alert severity="success">
                                        The name was successfully changed to: {name}
                                    </Alert>
                                ) : null}
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Box>
        </Box>
    );
}

export default Settings;
