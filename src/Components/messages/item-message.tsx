import { itemMesBlock } from '@/styles';
import { convertDate } from '@/utils';
import { COOKIES_KEY } from '@/utils/const';
import { getCookie } from '@/utils/getCookie';
import { Box, Typography } from '@mui/material';

interface ItemMeProps {
    user: string;
    text: string;
    email: string;
    date: string;
}

function ItemMessage({ user, text, email, date }: ItemMeProps) {
    const userData = getCookie(COOKIES_KEY.USER_DATA);
    const messageTime = convertDate(date);
    const companionMes = email !== userData.email;

    return (
        <Box sx={itemMesBlock}>
            {companionMes && (
                <Typography
                    fontSize={'15px'}
                    sx={{
                        ml: '10px',
                        mr: '10px',
                        color: '#5e55d6',
                        fontWeight: 'bold',
                        textAlign: 'left',
                    }}
                >
                    {user}
                </Typography>
            )}
            <Typography
                fontSize={'16px'}
                sx={{ ml: '10px', mr: '10px', textAlign: 'left' }}
            >
                {text}
            </Typography>
            <Typography
                fontSize={'11px'}
                sx={{
                    textAlign: 'right',
                    mr: '5px',
                    ml: '5px',
                    fontStyle: 'italic',
                }}
            >
                {messageTime}
            </Typography>
        </Box>
    );
}

export default ItemMessage;
