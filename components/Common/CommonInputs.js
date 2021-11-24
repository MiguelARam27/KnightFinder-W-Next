import React from 'react';
import { Form, Button, Message, TextArea, Divider } from 'semantic-ui-react';
import styles from '@/styles/SignUp.module.scss';
function CommonInputs({
  user: { bio, facebook, instagram, youtube, twitter },
  handleChange,
  showSocialLinks,
  showSocialLinksFunction,
}) {
  return (
    <>
      <div className={styles.inputContainer}>
        <label htmlFor="bio">Bio</label>
        <Form.Field
          required
          control={TextArea}
          name="bio"
          value={bio}
          onChange={handleChange}
          placeholder="tell us about yourself"
        />
      </div>
      <div className={styles.buttonContainer}>
        <Button
          content={!showSocialLinks ? 'Show social' : 'Hide social'}
          onClick={() => showSocialLinksFunction()}
        ></Button>
      </div>
      <Divider />
      {showSocialLinks && (
        <>
          <div className={styles.socialContainer}>
            <div className={styles.social}>
              <i aria-hidden="true" className="facebook f icon"></i>
              <input
                type="text"
                name="facebook"
                value={facebook}
                onChange={handleChange}
                placeholder="Enter Facebook Url"
              />
            </div>
            <div className={styles.social}>
              <i aria-hidden="true" className="twitter f icon"></i>
              <input
                type="text"
                name="twitter"
                value={twitter}
                onChange={handleChange}
                placeholder="Enter twitter Url"
              />
            </div>
            <div className={styles.social}>
              <i aria-hidden="true" className="instagram icon"></i>
              <input
                type="text"
                name="instagram"
                value={instagram}
                onChange={handleChange}
                placeholder="Enter instagram Url"
              />
            </div>
            <div className={styles.social}>
              <i aria-hidden="true" className="youtube f icon"></i>
              <input
                type="text"
                name="youtube"
                value={youtube}
                onChange={handleChange}
                placeholder="Enter youtube Url"
              />
            </div>
          </div>
          <Divider />
        </>
      )}
    </>
  );
}

export default CommonInputs;
