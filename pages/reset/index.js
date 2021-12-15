import React, { useState, useEffect } from 'react';
import { Form, Button, Message, Segment } from 'semantic-ui-react';
import baseUrl from '../../utils/baseUrl';
import catchErrors from '../../utils/catchErrors';
import axios from 'axios';
import styles from '@/styles/ForgotPage.module.scss';
function ResetPage() {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  const [emailChecked, setEmailChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${baseUrl}/api/reset`, { email });
      setEmailChecked(true);
    } catch (error) {
      setErrorMsg(catchErrors(error));
    }
    setLoading(false);
  };

  useEffect(() => {
    errorMsg !== null && setTimeout(() => setErrorMsg(errorMsg), 5000);
  }, [errorMsg]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.form}>
          <div className={styles.label}>
            <span>Enter your email to reset your password</span>
          </div>
          <div className={styles.inputContainer}>
            <input
              type="text"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="Enter email address"
            />
          </div>

          <div className={styles.buttonContainer}>
            <button onClick={resetPassword} className={styles.button}>
              Submit
            </button>
          </div>

          <div>
            {emailChecked && (
              <Message
                attached
                icon="mail"
                header="Check your Inbox"
                content="Please check your inbox for further instructions"
                success
              />
            )}
            {errorMsg && <Message error header="Oops!" content={errorMsg} />}
          </div>
        </div>
      </div>
    </>
  );
}

export default ResetPage;
