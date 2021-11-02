import App from 'next/app';
import axios from 'axios';
import { parseCookies, destroyCookie } from 'nookies';
import baseUrl from '../utils/baseUrl';
import { redirectUser } from '../utils/authUser';
import Layout from '../components/Layout/Layout';
import 'react-toastify/dist/ReactToastify.css';
import 'semantic-ui-css/semantic.min.css';
import { ThemeProvider } from '@mui/material';
import theme from '../config/theme';
import LandingLayout from '../components/Layout/LandingLayout';
// import '@/styles/Main.module.scss';
function MyApp({ Component, pageProps }) {
  const { token } = pageProps;
  return (
    <ThemeProvider theme={theme}>
      {token === null ? (
        <LandingLayout>
          <Component {...pageProps} />
        </LandingLayout>
      ) : (
        <Layout {...pageProps}>
          <Component {...pageProps} />
        </Layout>
      )}
    </ThemeProvider>
  );
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
  const { token } = parseCookies(ctx);
  let pageProps = {};
  pageProps.token = token || null;

  const protectedRoutes =
    ctx.pathname === '/home' ||
    ctx.pathname === '/[username]' ||
    ctx.pathname === '/post/[postId]' ||
    ctx.pathname === '/messages' ||
    ctx.pathname === '/notifications';

  if (!token) {
    protectedRoutes && redirectUser(ctx, '/');
  }
  //
  else {
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    try {
      console.log('here');
      const res = await axios.get(`${baseUrl}/api/auth`, {
        headers: { Authorization: token },
      });

      const { user, userFollowStats } = res.data;

      if (user) !protectedRoutes && redirectUser(ctx, '/home');

      pageProps.user = user;
      pageProps.userFollowStats = userFollowStats;
    } catch (error) {
      destroyCookie(ctx, 'token');
      redirectUser(ctx, '/login');
    }
  }

  return { pageProps };
};

export default MyApp;
