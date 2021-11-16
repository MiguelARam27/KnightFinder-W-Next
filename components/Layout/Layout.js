import React, { createRef, useState } from 'react';
import HeadTags from './HeadTags';
import Navbar from './Navbar';
import {
  Container,
  Visibility,
  Grid,
  Sticky,
  Ref,
  Segment,
} from 'semantic-ui-react';
import nprogress from 'nprogress';
import Router, { useRouter } from 'next/router';
import SideMenu from './home/SideMenu';
import MobileSideMenu from './home/MobileSideMenu';
import TopBar from './home/TopBar';
import Search from './Search';
import styles from '@/styles/HomeLayout.module.scss';
function Layout({ children, user }) {
  const contextRef = createRef();
  const router = useRouter();

  const messagesRoute = router.pathname === '/messages';

  Router.onRouteChangeStart = () => nprogress.start();
  Router.onRouteChangeComplete = () => nprogress.done();
  Router.onRouteChangeError = () => nprogress.done();

  const [showMobileMenu, setshowMobileMenu] = useState(false);

  const handleClick = () => {
    setshowMobileMenu(!showMobileMenu);
  };
  return (
    <>
      <HeadTags />

      <div className={styles.wrapper}>
        <TopBar handleClick={handleClick} showMobileMenu={showMobileMenu} />
        <MobileSideMenu
          user={user}
          showMobileMenu={showMobileMenu}
          handleClick={handleClick}
        />
        <div className={styles.flexWrapper}>
          <Ref innerRef={contextRef}>
            {!messagesRoute ? (
              <>
                <SideMenu user={user} showMobileMenu={showMobileMenu} />

                <Grid.Column width={10}>
                  <Visibility context={contextRef}>{children}</Visibility>
                </Grid.Column>

                <Grid.Column floated="left" width={4}>
                  <Sticky context={contextRef}>
                    <Segment basic>
                      <Search />
                    </Segment>
                  </Sticky>
                </Grid.Column>
              </>
            ) : (
              <>
                <Grid.Column floated="left" width={1} />
                <Grid.Column width={15}>{children}</Grid.Column>
              </>
            )}
          </Ref>
        </div>
      </div>
    </>
  );
}

export default Layout;
