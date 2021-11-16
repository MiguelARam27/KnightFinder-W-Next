import React from 'react';
import styles from '@/styles/HomeLayout.module.scss';
function TopBar({ showMobileMenu, handleClick }) {
  return (
    <div className={styles.topbar}>
      <span onClick={handleClick}>
        <i className="bars large icon"></i>
      </span>
    </div>
  );
}

export default TopBar;
