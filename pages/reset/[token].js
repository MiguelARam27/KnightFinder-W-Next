import React, { useState, useEffect } from 'react';
import { Form, Button, Message, Segment, Divider } from 'semantic-ui-react';
import baseUrl from '../../utils/baseUrl';
import catchErrors from '../../utils/catchErrors';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '@/styles/ForgotPage.module.scss';
function TokenPage() {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState({ field1: '', field2: '' });

  const { field1, field2 } = newPassword;

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [success, setSuccess] = useState(false);

  console.log(errorMsg);
  const handleChange = (e) => {
    setNewPassword({ ...newPassword, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    errorMsg !== null && setTimeout(() => setErrorMsg(null), 5000);
  }, [errorMsg]);

  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (field1 !== field2) {
        return setErrorMsg('passwords do not match');
      }

      await axios.post(`${baseUrl}/api/reset/token`, {
        password: field1,
        token: router.query.token,
      });
      setSuccess(true);
    } catch (error) {
      setErrorMsg(catchErrors(error));
    }
  };

  return (
    <div className={styles.container}>
      {!success && (
        <div className={styles.form}>
          <div className={styles.label}>
            <span>Enter your new password and confirm it</span>
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="field1" style={{ color: 'white' }}>
              New Password
            </label>
            <input
              placeholder="Enter New Password"
              name="field1"
              onChange={handleChange}
              value={field1}
              type="password"
              autoComplete="off"
            />
          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="field2" style={{ color: 'white' }}>
              Confirm New Password
            </label>
            <input
              placeholder="Confirm New Password"
              name="field2"
              onChange={handleChange}
              value={field2}
              type="password"
              autoComplete="off"
            />
          </div>

          <Divider hidden />
          <div className={styles.buttonContainer}>
            <button onClick={resetPassword} className={styles.button}>
              Submit
            </button>
          </div>

          {errorMsg && (
            <div className={styles.label}>
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      )}

      {success && (
        <Message
          attached
          success
          size="large"
          header="Password reset successfull"
          icon="check"
          content="Login Again"
          style={{ cursor: 'pointer' }}
          onClick={() => router.push('/login')}
        />
      )}
    </div>
  );
}

export default TokenPage;
