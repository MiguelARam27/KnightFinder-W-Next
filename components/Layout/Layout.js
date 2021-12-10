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

                <div className={styles.mainContent}>{children}</div>
                <div className={styles.searchContainer}>
                  <Search />
                </div>
              </>
            ) : (
              <>
                <div className={styles.messageContainer}>{children}</div>
              </>
            )}
          </Ref>
        </div>
      </div>
    </>
  );
}

export default Layout;
