import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Message, Segment, Divider } from 'semantic-ui-react';
import CommonInputs from '../components/Common/CommonInputs';
import ImageDropDiv from '../components/Common/ImageDropDiv';
import {
  HeaderMessage,
  FooterMessage,
} from '../components/Common/WelcomeMessage';
import axios from 'axios';
import baseUrl from '../utils/baseUrl';
import { registerUser } from '../utils/authUser';
import uploadPic from '../utils/uploadPicToCloudinary';
import styles from '@/styles/SignUp.module.scss';
import Loader from '../components/Layout/Loader';
const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
let cancel;

function Signup() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    facebook: '',
    youtube: '',
    twitter: '',
    instagram: '',
  });

  const { name, email, password, bio } = user;

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'media') {
      setMedia(files[0]);
      setMediaPreview(URL.createObjectURL(files[0]));
    }

    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const [username, setUsername] = useState('');
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);

  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [highlighted, setHighlighted] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    const isUser = Object.values({ name, email, password, bio }).every((item) =>
      Boolean(item)
    );
    isUser ? setSubmitDisabled(false) : setSubmitDisabled(true);
  }, [user]);

  useEffect(() => {
    document.title = 'Sign up';
  }, []);

  const checkUsername = async () => {
    setUsernameLoading(true);
    try {
      cancel && cancel();

      const CancelToken = axios.CancelToken;

      const res = await axios.get(`${baseUrl}/api/signup/${username}`, {
        cancelToken: new CancelToken((canceler) => {
          cancel = canceler;
        }),
      });

      if (errorMsg !== null) setErrorMsg(null);

      if (res.data === 'Available') {
        setUsernameAvailable(true);
        setUser((prev) => ({ ...prev, username }));
      }
    } catch (error) {
      setErrorMsg('Username Not Available');
      setUsernameAvailable(false);
    }
    setUsernameLoading(false);
  };

  useEffect(() => {
    username === '' ? setUsernameAvailable(false) : checkUsername();
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    let profilePicUrl;
    if (media !== null) {
      profilePicUrl = await uploadPic(media);
    }

    if (media !== null && !profilePicUrl) {
      setFormLoading(false);
      return setErrorMsg('Error Uploading Image');
    }

    await registerUser(user, profilePicUrl, setErrorMsg, setFormLoading);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <form className={styles.form}>
            <div className={styles.header}>
              <h1>Join your fellow Knights!</h1>
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                required
                placeholder="Name"
                name="name"
                value={name}
                onChange={handleChange}
              />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="Email">Email</label>
              <input
                type="email"
                required
                placeholder="Enter your email address"
                name="email"
                value={email}
                onChange={handleChange}
              />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                required
                label="password"
                placeholder="Enter your password"
                name="password"
                value={password}
                onChange={handleChange}
              />
            </div>
            <div className={styles.inputContainer}>
              <Form.Input
                loading={usernameLoading}
                error={!usernameAvailable}
                required
                label="Username"
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (regexUserName.test(e.target.value)) {
                    setUsernameAvailable(true);
                  } else {
                    setUsernameAvailable(false);
                  }
                }}
                fluid
                icon={usernameAvailable ? 'check' : 'close'}
                iconPosition="left"
              />
            </div>

            <CommonInputs
              user={user}
              showSocialLinks={showSocialLinks}
              setShowSocialLinks={setShowSocialLinks}
              handleChange={handleChange}
            />

            <div className={styles.inputContainer}>
              <label htmlFor="name">Profile Pic</label>
              <ImageDropDiv
                mediaPreview={mediaPreview}
                setMediaPreview={setMediaPreview}
                setMedia={setMedia}
                inputRef={inputRef}
                highlighted={highlighted}
                setHighlighted={setHighlighted}
                handleChange={handleChange}
              />
            </div>
            <div className={styles.inputContainer}>
              {formLoading ? (
                <Loader />
              ) : (
                <Button
                  icon="signup"
                  content="Signup"
                  type="submit"
                  color="orange"
                  onClick={handleSubmit}
                  disabled={submitDisabled || !usernameAvailable}
                />
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup;
