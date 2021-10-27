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
import styles from '@/styles/LandingNav.module.css';
import Link from 'next/link';
import MobileNav from './MobileNav';

export default function LandingNav() {
  return (
    <>
      <AppBar
        position="static"
        sx={{ bgcolor: 'common.black', display: { xs: 'none', lg: 'block' } }}
        style={{ padding: '.8rem 0' }}
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
              <div className={styles.logoContainer}>
                <img
                  src={'/img/Logo.png'}
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
              <Link href={'/register'}>
                <a className={styles.link}>register</a>
              </Link>
              {/* <span>hello</span>
            <span>hello</span> */}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <MobileNav />
    </>
  );
}
