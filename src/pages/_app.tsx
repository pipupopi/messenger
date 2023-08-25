import '@/styles/globals.css';
import '@/styles/Home.module.css';
import Head from 'next/head';
import { createTheme, ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '@/utils/redux/store';

export default function App({ Component, pageProps }: AppProps) {
    const theme = createTheme({
        palette: {
            primary: {
                main: '#5e55d6',
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <Head>
                    <title>Messenger</title>
                    <meta name="description" content="App chat" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1"
                    />
                </Head>
                <main className={'main'}>
                    <Component {...pageProps} />
                </main>
            </Provider>
        </ThemeProvider>
    );
}
