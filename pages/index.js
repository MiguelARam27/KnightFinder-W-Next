import Wave from '../components/Layout/landing/Wave';
import styles from '@/styles/Index.module.css';
import { Grid } from '@mui/material';
export default function index() {
  return (
    <div className={styles.container}>
      <Grid container>
        <Grid item lg={6} xs={12}></Grid>
        <Grid item lg={6} xs={12}></Grid>
      </Grid>
    </div>
  );
}
