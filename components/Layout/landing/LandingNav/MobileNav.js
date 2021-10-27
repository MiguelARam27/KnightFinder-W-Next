import {
  AppBar,
  Drawer,
  Toolbar,
  List,
  ListItemText,
  ListItem,
  ListItemIcon,
  ListItemButton,
  Grid,
  Typography,
  IconButton,
} from '@mui/material';
import { useState } from 'react';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import styles from '@/styles/LandingNav.module.css';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/router';
export default function MobileNav() {
  const [drawerToggle, setDrawerToggle] = useState(false);
  const handleDrawerToggle = () => {
    setDrawerToggle(!drawerToggle);
  };
  const router = useRouter();
  return (
    <AppBar
      position="static"
      sx={{ display: { lg: 'none', xs: 'block' }, bgcolor: 'common.black' }}
      style={{ padding: '.7rem 0' }}
    >
      <Toolbar>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={4}>
            <div className={styles.mobileLogoContainer}>
              <img
                src={'/img/Logo.png'}
                style={{ height: '2.5rem', width: '2.5rem' }}
              />
              <Typography variant="h1">knightFinder</Typography>
            </div>
          </Grid>
          <Grid
            item
            xs={5}
            flexDirection="row"
            className={styles.mobileMenuContainer}
            sx={{ bgColor: 'primary.main' }}
          >
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          </Grid>
        </Grid>

        <Drawer
          anchor={'right'}
          open={drawerToggle}
          onClose={handleDrawerToggle}
          sx={{ display: { lg: 'none', xs: 'block' } }}
        >
          <List
            sx={{
              width: '30vw',
              bgcolor: 'common.black',
              height: '100%',
              overFlow: 'hidden',
            }}
          >
            <ListItem>
              <ListItemText>
                <Link href={'/signup'}>
                  <a
                    className={styles.link}
                    onClick={() => {
                      handleDrawerToggle();
                    }}
                  >
                    register
                  </a>
                </Link>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <Link href={'/login'} onClick={handleDrawerToggle}>
                  <a
                    className={styles.link}
                    onClick={() => {
                      handleDrawerToggle();
                    }}
                  >
                    login
                  </a>
                </Link>
              </ListItemText>
            </ListItem>
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}
