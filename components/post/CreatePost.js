import React, { useState, useRef } from 'react';
import { Form, Button, Image, Divider, Message, Icon } from 'semantic-ui-react';
import uploadPic from '../../utils/uploadPicToCloudinary';
import { submitNewPost } from '../../utils/postActions';
import styles from '@/styles/CreatePost.module.scss';
function CreatePost({ user, setPosts }) {
  const [newPost, setNewPost] = useState({ text: '', location: '' });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const [error, setError] = useState(null);
  const [highlighted, setHighlighted] = useState(false);

  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'media') {
      setMedia(files[0]);
      setMediaPreview(URL.createObjectURL(files[0]));
    }

    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let picUrl;
    if (media !== null) {
      picUrl = await uploadPic(media);
      if (!picUrl) {
        setLoading(false);
        return setError('Error Uploading Image');
      }
    }

    await submitNewPost(
      newPost.text,
      newPost.location,
      picUrl,
      setPosts,
      setNewPost,
      setError
    );

    setMedia(null);
    setMediaPreview(null);
    setLoading(false);
  };

  const addStyles = () => ({
    textAlign: 'center',
    height: '150px',
    border: 'dotted',
    paddingTop: media === null ? '60px' : '0px',
    padding: '5rem .5rem',
    cursor: 'pointer',
    borderColor: highlighted ? 'green' : 'black',
  });

  return (
    <>
      <Form error={error !== null} onSubmit={handleSubmit}>
        <Message
          error
          onDismiss={() => setError(null)}
          content={error}
          header="Oops"
        />

        <Form.Group>
          <Image src={user.profilePicUrl} circular avatar />
          <Form.TextArea
            placeholder="Share your thoughts"
            name="text"
            value={newPost.text}
            onChange={handleChange}
            rows={4}
            width={14}
          />
        </Form.Group>

        <Form.Group>
          <Form.Input
            value={newPost.location}
            name="location"
            onChange={handleChange}
            label="Add your Location"
            icon="map marker alternate"
            placeholder="Add your location"
          />

          <input
            ref={inputRef}
            onChange={handleChange}
            name="media"
            style={{ display: 'none' }}
            type="file"
            accept="image/*"
          />
        </Form.Group>
        <div
          style={addStyles()}
          onDragOver={(e) => {
            e.preventDefault();
            setHighlighted(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setHighlighted(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setHighlighted(true);

            const droppedFile = Array.from(e.dataTransfer.files);

            setMedia(droppedFile[0]);
            setMediaPreview(URL.createObjectURL(droppedFile[0]));
          }}
        >
          {media === null ? (
            <>
              <Icon name="plus" onClick={() => inputRef.current.click()} />
            </>
          ) : (
            <>
              <Image
                style={{ height: '150px', width: '150px' }}
                src={mediaPreview}
                alt={'PostImage'}
                centered
                size="medium"
                onClick={() => inputRef.current.click()}
              />
            </>
          )}
        </div>
        <Divider hidden />

        <button
          disabled={newPost.text === '' || loading}
          className={
            newPost.text === '' || loading
              ? `${styles.button} ${styles.disabled}`
              : styles.button
          }
        >
          Post
        </button>
      </Form>
    </>
  );
}

export default CreatePost;
