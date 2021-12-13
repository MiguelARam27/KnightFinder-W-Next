import React, { useState } from 'react';
import { Form, Segment } from 'semantic-ui-react';

function MessageInputField({ sendMessage }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <Form
        reply
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(text);
          setText('');
        }}
      >
        <Form.Input
          size="large"
          placeholder="Send New Message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          action={{
            color: 'blue',
            icon: 'telegram plane',
            disabled: text === '',
            loading: loading,
          }}
        />
      </Form>
    </div>
  );
}

export default MessageInputField;
