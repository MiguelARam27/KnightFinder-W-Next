import React from 'react';
import { List, Icon } from 'semantic-ui-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { logoutUser } from '../../../utils/authUser';
import styles from '@/styles/HomeLayout.module.scss';
function SideMenu({
  user: { unreadNotification, email, unreadMessage, username },
}) {
  const router = useRouter();

  const isActive = (route) => router.pathname === route;

  return (
    <>
      <div className={styles.sidebar}>
        <ul>
          <Link href="/home">
            <li className={isActive('/home') ? `${styles.link_active}` : null}>
              <i className="home large icon "></i>
              <span>Home</span>
            </li>
          </Link>
          <Link href="/messages">
            <li
              className={isActive('/messages') ? `${styles.link_active}` : null}
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
            >
              <i className="bell large icon"></i>
              <span>Notifications</span>
            </li>
          </Link>

          <Link href={`/user/${username}`}>
            <li
              className={isActive('/account') ? `${styles.link_active}` : null}
            >
              <i className="user large icon"></i>
              <span>Account</span>
            </li>
          </Link>
          <li onClick={() => logoutUser(email)}>
            <i className="log out large icon"></i>
            <span>Logout</span>
          </li>
        </ul>
      </div>
    </>
  );
}

export default SideMenu;
