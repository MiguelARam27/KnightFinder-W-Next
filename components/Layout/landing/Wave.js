import { useEffect, useState } from 'react';

export default function Wave() {
  const [state, setstate] = useState(false);
  useEffect(() => {
    function handleResize() {
      console.log('resized to: ', window.innerWidth, 'x', window.innerHeight);
    }

    window.addEventListener('resize', handleResize);
  }, []);

  return (
    <svg
      width="2595"
      height="1031"
      viewBox="0 0 1000 363"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', zIndex: '0', left: '0', bottom: '0' }}
      //   fill="none"
      //   xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1175 73.0319C1103.8 325.032 145.166 202 61.4995 29.9997C72.5002 35.1864 64.6967 30.3426 66.8041 30.0319C66.8505 30.0107 66.9157 30 66.9998 30C66.9333 30.0119 66.8681 30.0225 66.8041 30.0319C58.2863 33.9276 692.63 420.139 1175 73.0319Z"
        fill="#FFC904"
      />
      <path
        d="M1148 50C1076.8 302 150.666 245 66.9998 72.9997C69.3439 72.3768 70.1971 73.3426 72.3044 73.0319C72.3508 73.0107 0.415942 231 0.500013 231C0.433562 231.012 72.3684 73.0225 72.3044 73.0319C63.7866 76.9276 665.63 397.107 1148 50Z"
        fill="#FFC904"
      />
      <path
        d="M1195 97C1123.8 349 145.362 172.968 61.6952 0.967773C64.0393 0.34486 64.8925 1.31072 66.9998 1C67.0462 0.978755 67.1114 0.968048 67.1955 0.968048C67.1291 0.979932 67.0638 0.990555 66.9998 1C58.4821 4.89568 712.63 444.107 1195 97Z"
        fill="#FFC904"
      />
    </svg>
  );
}
