import { MESSAGES } from '@/pages/chat';
import { listMesBlock, messageBlock } from '@/styles';
import {
    COOKIES_KEY,
    PAGES_HREF,
    SCROLL_THRESHOLD,
    SLICE_VALUES,
} from '@/utils/const';
import { getCookie } from '@/utils/getCookie';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import ItemMessage from './item-message';

interface MessageList {
    data: {
        createdAt: string;
        text: string;
        updateAt: string;
        user: {
            email: string;
            name: string;
        };
        ___v: number;
        _id: string;
    }[];
}

const MessageList = memo(function MessageList({ data }: MessageList) {
    const router = useRouter();
    const userData = getCookie(COOKIES_KEY.USER_DATA);
    const chatRef = useRef<HTMLDivElement>(null);
    const currentChatRef = chatRef.current;
    const [scrollTop, setScrollTop] = useState(currentChatRef?.scrollHeight);
    const [messages, setMessages] = useState<MESSAGES[]>([]);
    const [showArrow, setShowArrow] = useState(false);

    useEffect(() => {
        userData ? null : router.push(PAGES_HREF.AUTH);
    }, [userData, router]);

    const smoothScrollTo = useCallback(() => {
        if (currentChatRef) {
            currentChatRef.scrollTop = currentChatRef.scrollHeight;
        }
    }, [currentChatRef]);

    useEffect(() => {
        setMessages(
            [...data].slice(SLICE_VALUES.INITIAL, SLICE_VALUES.INCREMENT)
        );
        smoothScrollTo();
    }, [data, smoothScrollTo]);

    const sliceMessages = useCallback(() => {
        if (currentChatRef) {
            if (currentChatRef.scrollTop <= SCROLL_THRESHOLD) {
                const newSliceValue = messages.length + SLICE_VALUES.INCREMENT;
                setMessages((prevMessages) =>
                    [...data].slice(SLICE_VALUES.INITIAL, newSliceValue)
                );
            }
        }
    }, [currentChatRef, data, messages.length]);

    useEffect(() => {
        currentChatRef?.addEventListener('scroll', () => {
            sliceMessages();
            setScrollTop(
                currentChatRef.scrollHeight - currentChatRef.clientHeight
            );
            Math.round(currentChatRef.scrollTop) === scrollTop
                ? setShowArrow(false)
                : setShowArrow(true);
        });
        return () => {
            currentChatRef?.removeEventListener('scroll', sliceMessages);
        };
    }, [sliceMessages, scrollTop, currentChatRef]);

    return (
        <>
            <Box ref={chatRef} sx={messageBlock}>
                {[...messages].reverse().map((item) => (
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
