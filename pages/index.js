import { useEffect } from 'react';
import Wave from '../components/Layout/landing/Wave';
import styles from '@/styles/Index.module.scss';
import { Grid } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import ContactsIcon from '@mui/icons-material/Contacts';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
export default function index() {
  useEffect(() => {
    document.title = 'KnightFinder';
  }, []);
  return (
    <>
      <div className={styles.container}>
        <div className={styles.leftContainer}>
          <div className={styles.hide} style={{ overflow: 'hidden' }}>
            <h2>We connect</h2>
          </div>
          <div className={styles.hide} style={{ overflow: 'hidden' }}>
            <h2>you to your</h2>
          </div>
          <div className={styles.hide} style={{ overflow: 'hidden' }}>
            <h2>
              Fellow <span>knights</span>
            </h2>
          </div>
          <p>A complementary service for all UCF students </p>
        </div>
        <div className={styles.rightContainer}>
          <div className={styles.image} style={{ zIndex: '2' }}>
            <img src="/img/Major.jpg" alt="Students discussing info" />
          </div>
        </div>
        <Wave />
      </div>
      <div className={styles.container2}>
        <div>
          <div className={styles.services}>
            <h2>
              Be a <span>Knight</span> for life
            </h2>
            <div className={styles.cards}>
              <div className={styles.card}>
                <div className={styles.icon}>
                  <AccessTimeIcon />

                  <h3>lifelong account</h3>
                </div>
                <p>Keep your account even after graduation</p>
              </div>
              <div className={styles.card}>
                <div className={styles.icon}>
                  <PeopleIcon />
                  <h3>social circle</h3>
                </div>
                <p>Keep in contact with friends</p>
              </div>
              <div className={styles.card}>
                <div className={styles.icon}>
                  <ContactsIcon />
                  <h3>new connections</h3>
                </div>
                <p>Make new connections </p>
              </div>
              <div className={styles.card}>
                <div className={styles.icon}>
                  <PersonAddAlt1Icon />

                  <h3>profile</h3>
                </div>
                <p>Build a profile around you</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <img src="/img/grad.jpg" alt="graduating student" />
        </div>
      </div>
    </>
  );
}
