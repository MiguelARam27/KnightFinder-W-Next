import LandingNav from './LandingNav/index';

export default function LandingLayout({ children }) {
  return (
    <div>
      <LandingNav />
      {children}
    </div>
  );
}
