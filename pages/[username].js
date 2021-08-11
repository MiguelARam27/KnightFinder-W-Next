import React from 'react';
import { useRouter } from 'next/router';
function ProfilePage() {
  const router = useRouter();

  const { username } = router.query;
  return <div>{username}</div>;
}

ProfilePage.getInitialProps = async (ctx) => {
  const { username } = ctx.query;

  return {};
};

export default ProfilePage;
