import { Form, Button, Message, Segment } from 'semantic-ui-react';
import baseUrl from '../../utils/baseUrl';
import catchErrors from '../../utils/catchErrors';
import axios from 'axios';
import { useRouter } from 'next/router';
function TokenPage() {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState({ field1: '', field2: '' });

  const { field1, field2 } = newPassword;

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const [name, value] = e.target.value;
    setNewPassword({ ...newPassword, [name]: value });
  };

  useEffect(() => {
    errorMsg !== null && setTimeout(() => setErrorMsg(null), 5000);
  }, [errorMsg]);

  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
    } catch (error) {
      setErrorMsg(catchErrors(error));
    }
  };

  return (
    <>
      {emailChecked ? (
        <Message
          attached
          success
          icon="check"
          header="Password reset successfully"
          content="Login again"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            router.push('/login');
          }}
        />
      ) : (
        <Message
          attached
          icon="settings"
          header="Reset Password"
          color="teal"
        />
      )}

      {!success && (
        <Form
          loading={loading}
          onSubmit={resetPassword}
          error={errorMsg !== null}
        >
          <Message error header="Oops!" content={errorMsg} />

          <Segment>
            <Form.Input
              fluid
              icon="eye"
              type="password"
              iconPosition="left"
              label="New Password"
              placeholder="Enter new Password"
              name="field1"
              onChange={handleChange}
              value={field1}
              required
            />
            <Form.Input
              fluid
              icon="eye"
              type="password"
              iconPosition="left"
              label="Confirm Password"
              placeholder="Confirm new Password"
              name="field2"
              onChange={handleChange}
              value={field2}
              required
            />

            <Divider hidden />

            <Button
              disabled={field1 === '' || field2 === '' || loading}
              icon="configure"
              type="submit"
              color="orange"
              content="Reset"
            />
          </Segment>
        </Form>
      )}
    </>
  );
}

export default TokenPage;
