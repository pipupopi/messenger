import { MESSAGES } from '@/pages/chat';
import { listMesBlock, messageBlock } from '@/styles';
import { COOKIES_KEY } from '@/utils/const';
import { getCookie } from '@/utils/getCookie';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Button } from '@mui/material';
import { memo, useEffect, useRef, useState } from 'react';
import ItemMessage from './item-message';

interface MESSAGE_LIST {
    data: MESSAGES[];
}

const MessageList = memo(function MessageList({ data }: MESSAGE_LIST) {
    const userData = getCookie(COOKIES_KEY.USER_DATA);
    const chatRef = useRef<HTMLDivElement>(null);
    const currentChatRef = chatRef.current;
    const [scrollTop, setScrollTop] = useState(currentChatRef?.scrollHeight);
    const [showArrow, setShowArrow] = useState(false);

    function smoothScrollTo() {
        if (currentChatRef) {
            currentChatRef.scrollTop = currentChatRef.scrollHeight;
        }
    }

    useEffect(() => {
        smoothScrollTo();
    }, [data]);

    useEffect(() => {
        currentChatRef?.addEventListener('scroll', () => {
            setScrollTop(
                currentChatRef.scrollHeight - currentChatRef.clientHeight
            );
            Math.round(currentChatRef.scrollTop) === scrollTop
                ? setShowArrow(false)
                : setShowArrow(true);
        });
    }, [scrollTop, currentChatRef]);

    return (
        <>
            <Box ref={chatRef} sx={messageBlock}>
                {data.map((item) => (
                    <Box
                        sx={{
                            justifyContent: `${
                                item.user.email === userData.email
                                    ? 'flex-end'
                                    : 'flex-start'
                            }`,
                            ...listMesBlock,
                        }}
                        key={item._id}
                    >
                        <ItemMessage
                            text={item.text}
                            user={item.user.name}
                            email={item.user.email}
                            date={item.createdAt}
                        />
                    </Box>
                ))}
            </Box>
            {showArrow ? (
                <Box
                    sx={{
                        maxWidth: '100%',
                        height: '45px',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        mt: '-45px',
                        mr: '10px',
                    }}
                >
                    <Button
                        onClick={smoothScrollTo}
                        color="primary"
                        size="small"
                        variant="contained"
                        sx={{
                            position: 'absolute',
                        }}
                    >
                        <KeyboardArrowDownIcon />
                    </Button>
                </Box>
            ) : null}
        </>
    );
});

export default MessageList;
