import React from 'react';
import styles from '@/styles/Loader.module.scss';
export default function Loader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div className={styles.ring}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
