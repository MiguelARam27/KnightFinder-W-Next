import React, { useState, useRef } from 'react';
import { Form, Button, Image, Divider, Message, Icon } from 'semantic-ui-react';
import uploadPic from '../../utils/uploadPicToCloudinary';
const CreatePost = ({ user, setPosts }) => {
  const [newPost, setNewPost] = useState({ text: '', location: '' });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const [error, setError] = useState(null);
  const [highlighted, setHighlighted] = useState(false);

  const [media, setMedia] = useState(false);
  const [mediaPreview, setMediaPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target.value;

    if (name === 'media') {
      setMedia(files[0]);
      setMedia(URL.createObjectURL(files[0]));
    }

    setNewPost({ ...newPost, [name]: value });
  };

  const handleSubmit = (e) => {
    console.log(e);
  };

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
          <Image src={user.profilePicurl} circular avatar />
          <Form.TextArea
            placeHolder="Share your thoughts"
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
            icon="map maerker alternate"
            placeHolder="Add your location"
          />

          <input
            ref={inputRef}
            onChange={handleChange}
            name="media"
            style={{ display: 'none' }}
            type="file"
            accept="image/*"
          />

          <div style={{ textAlign: 'center', height: '150px' }}></div>
        </Form.Group>
      </Form>
    </>
  );
};

export default CreatePost;
