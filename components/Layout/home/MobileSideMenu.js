import React from 'react';
import { List, Icon } from 'semantic-ui-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { logoutUser } from '../../../utils/authUser';
import styles from '@/styles/HomeLayout.module.scss';
function MobileSideMenu({
  user: { unreadNotification, email, unreadMessage, username },
  showMobileMenu,
  handleClick,
}) {
  const router = useRouter();

  const isActive = (route) => {
    if (router.pathname.includes(route)) {
      return true;
    } else return false;
  };
  console.log(router.pathname);

  return (
    <>
      <div
        className={
          showMobileMenu
            ? `${styles.mobileSideBar} ${styles.open} `
            : `${styles.mobileSideBar} ${styles.closed}`
        }
      >
        <ul>
          <Link href="/home">
            <li
              className={isActive('home') ? `${styles.link_active}` : null}
              onClick={() => handleClick()}
            >
              <i className="home large icon "></i>
              <span>Home</span>
            </li>
          </Link>
          <Link href="/messages">
            <li
              className={isActive('/messages') ? `${styles.link_active}` : null}
              onClick={() => handleClick()}
            >
              <i className="mail large icon"></i>
              <span>Messages</span>
            </li>
          </Link>
          <Link href="/notifications">
            <li
              className={
                isActive('/notifications') ? `${styles.link_active}` : null
              }
              onClick={() => handleClick()}
            >
              <i className="bell large icon"></i>
              <span>Notifications</span>
            </li>
          </Link>

          <Link href={`/user/${username}`}>
            <li
              className={isActive('user') ? `${styles.link_active}` : null}
              onClick={() => handleClick()}
            >
              <i className="user large icon"></i>
              <span>Account</span>
            </li>
          </Link>
          <li onClick={() => logoutUser(email)} onClick={() => handleClick()}>
            <i className="log out large icon"></i>
            <span>Logout</span>
          </li>
          <li onClick={() => handleClick()}>
            <i className="close large icon"></i>
            <span>Close</span>
          </li>
        </ul>
      </div>
    </>
  );
}

export default MobileSideMenu;
