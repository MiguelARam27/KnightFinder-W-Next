import React, { useState, useEffect } from 'react';
import { Form, Button, Message, Segment, Divider } from 'semantic-ui-react';
import { loginUser } from '../utils/authUser';
import {
  HeaderMessage,
  FooterMessage,
} from '../components/Common/WelcomeMessage';
import cookie from 'js-cookie';
import styles from '@/styles/Login.module.scss';
import Link from 'next/link';
function Login() {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const { email, password } = user;
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const isUser = Object.values({ email, password }).every((item) =>
      Boolean(item)
    );
    isUser ? setSubmitDisabled(false) : setSubmitDisabled(true);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await loginUser(user, setErrorMsg, setFormLoading);
  };

  useEffect(() => {
    document.title = 'Welcome Back';
    const userEmail = cookie.get('userEmail');

    if (userEmail) setUser((prev) => ({ ...prev, email: userEmail }));
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.bottomGraphic} />
        <div className={styles.topGraphic} />
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <h1>Welcome Back Knight!</h1>
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              placeholder="Enter your email address"
              value={email}
              onChange={handleChange}
              name="email"
            />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="Password">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              name="password"
              onChange={handleChange}
            />
          </div>
          <Divider hidden />
          <Button
            content="Login"
            type="submit"
            // disabled={submitDisabled}
          />
          <div className={styles.buttonContainer}>
            <Link href={'/forgot'}>
              <span className={styles.button1}>forgot</span>
            </Link>
            <Link href={'/signup'}>
              <span className={styles.button2}>Signup</span>
            </Link>
          </div>

          {/* <HeaderMessage />
          <Form
            loading={formLoading}
            error={errorMsg !== null}
            onSubmit={handleSubmit}
          >
            <Message
              error
              header="Oops!"
              content={errorMsg}
              onDismiss={() => setErrorMsg(null)}
            />

            <Segment>
              <Form.Input
                required
                label="Email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={handleChange}
                fluid
                icon="envelope"
                iconPosition="left"
                type="email"
              />

              <Form.Input
                label="Password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={handleChange}
                fluid
                icon={{
                  name: 'eye',
                  circular: true,
                  link: true,
                  onClick: () => setShowPassword(!showPassword),
                }}
                iconPosition="left"
                type={showPassword ? 'text' : 'password'}
                required
              />
            </Segment>
          </Form>

          <FooterMessage /> */}
        </div>
      </div>
    </>
  );
}

export default Login;
