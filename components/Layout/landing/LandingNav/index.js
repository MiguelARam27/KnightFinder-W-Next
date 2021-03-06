import {
  AppBar,
  Typography,
  Grid,
  Drawer,
  Toolbar,
  List,
  ListItemText,
  ListItem,
  ListItemIcon,
  ListItemButton,
} from '@mui/material';
import styles from '@/styles/LandingNav.module.scss';
import Link from 'next/link';
import MobileNav from './MobileNav';

import { useRouter } from 'next/router';
export default function LandingNav() {
  const router = useRouter();
  const handleClick = () => {
    router.push('/');
  };
  return (
    <>
      <AppBar
        position="static"
        sx={{ bgcolor: 'common.black', display: { xs: 'none', lg: 'block' } }}
        className={styles.nav}
      >
        <Toolbar>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Grid item lg={4}>
              <div className={styles.logoContainer} onClick={handleClick}>
                <img
                  src={'/img/knight.png'}
                  style={{ height: '5rem', width: '5rem' }}
                />
                <Typography variant="h1">knightFinder</Typography>
              </div>
            </Grid>
            <Grid
              item
              xs={5}
              flexDirection="row"
              className={styles.linkContainer}
              sx={{ bgColor: 'primary.main' }}
            >
              <Link href={'/login'}>
                <a className={styles.link}>login</a>
              </Link>
              <Link href={'/signup'}>
                <a className={styles.link}>register</a>
              </Link>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <MobileNav />
    </>
  );
}
